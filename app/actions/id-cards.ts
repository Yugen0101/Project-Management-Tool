'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import QRCode from 'qrcode';
import { revalidatePath } from 'next/cache';

// Generate unique card number based on role
export async function generateCardNumber(role: string): Promise<string> {
    const prefix = role === 'admin' ? 'ADM' : role === 'associate' ? 'ASC' : 'MEM';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
}

// Generate employee ID
export async function generateEmployeeId(role: string): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const roleCode = role === 'admin' ? 'A' : role === 'associate' ? 'S' : 'M';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `EMP${year}${roleCode}${random}`;
}

// Generate random password
function generateRandomPassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

// Send password email to user
async function sendPasswordEmail(userEmail: string, userName: string, password: string) {
    // TODO: Integrate with your email service (Resend, SendGrid, etc.)
    // For now, we'll log it (in production, this should send an actual email)
    console.log(`
        ========================================
        ID CARD CREDENTIALS
        ========================================
        To: ${userEmail}
        Name: ${userName}
        
        Your login credentials have been created:
        Email: ${userEmail}
        Password: ${password}
        
        Please change your password after first login.
        ========================================
    `);

    // In production, replace with actual email sending:
    // await resend.emails.send({
    //     from: 'noreply@taskforge.com',
    //     to: userEmail,
    //     subject: 'Your TaskForge Login Credentials',
    //     html: `<p>Your password is: <strong>${password}</strong></p>`
    // });
}

// Create ID card
export async function createIdCard(data: {
    userId: string;
    photoUrl: string;
    department?: string;
    phone?: string;
    bloodGroup?: string;
    employeeId?: string;
    customFields?: Record<string, any>;
}) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Get user details
    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.userId)
        .single();

    if (!user) {
        return { success: false, error: 'User not found' };
    }

    // Check if user already has an active card
    const { data: existingCard } = await supabase
        .from('id_cards')
        .select('id')
        .eq('user_id', data.userId)
        .eq('status', 'active')
        .single();

    if (existingCard) {
        return { success: false, error: 'User already has an active ID card. Please revoke the existing card first.' };
    }

    // Generate card number and employee ID
    const cardNumber = await generateCardNumber(user.role);
    const employeeId = data.employeeId || await generateEmployeeId(user.role);

    // Generate random password for the user
    const randomPassword = generateRandomPassword();

    // Create verification URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/verify-card/${cardNumber}`;

    // Generate QR code data (JSON for offline verification)
    const qrData = JSON.stringify({
        cardNumber,
        userId: user.id,
        name: user.full_name,
        role: user.role,
        employeeId,
        email: user.email,
        department: data.department,
        issuedAt: new Date().toISOString(),
        verificationUrl
    });

    // Generate QR code image
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 1,
        color: {
            dark: '#1c1917',
            light: '#ffffff'
        }
    });

    // Determine template based on role
    const templateId = user.role; // 'admin', 'associate', or 'member'

    // Create card
    const { data: card, error } = await supabase
        .from('id_cards')
        .insert({
            user_id: data.userId,
            card_number: cardNumber,
            employee_id: employeeId,
            photo_url: data.photoUrl,
            department: data.department,
            phone: data.phone,
            blood_group: data.bloodGroup,
            qr_code_data: qrCodeDataUrl,
            qr_verification_url: verificationUrl,
            template_id: templateId,
            custom_fields: data.customFields || {},
            issued_by: currentUser.id
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    // Send password email to user
    await sendPasswordEmail(user.email, user.full_name, randomPassword);

    revalidatePath('/admin/id-cards');
    revalidatePath('/admin/users');

    return {
        success: true,
        data: card,
        message: `ID card created successfully. Login credentials have been sent to ${user.email}`
    };
}

// Get user's ID card
export async function getUserIdCard(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('id_cards')
        .select(`
            *,
            user:users!user_id(full_name, email, role, created_at),
            issuer:users!issued_by(full_name),
            template:id_card_templates!template_id(name, design_config)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

    if (error) {
        // Handle "no rows found" gracefully
        if (error.code === 'PGRST116') {
            return { success: true, data: null };
        }

        console.error('Error fetching ID card:', {
            message: error?.message || 'Unknown error',
            details: error?.details,
            hint: error?.hint,
            code: error?.code
        });
        return { success: false, error: error?.message || 'Failed to fetch ID card' };
    }

    return { success: true, data };
}

// Verify card by card number (public endpoint)
export async function verifyCard(cardNumber: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('id_cards')
        .select(`
            *,
            user:users!user_id(full_name, role)
        `)
        .eq('card_number', cardNumber)
        .single();

    if (error) {
        return { success: false, error: 'Card not found' };
    }

    // Log the verification
    await supabase
        .from('id_card_access_logs')
        .insert({
            card_id: data.id,
            verification_method: 'online',
            access_granted: data.status === 'active'
        });

    return {
        success: true,
        data: {
            cardNumber: data.card_number,
            name: data.user.full_name,
            role: data.user.role,
            status: data.status,
            department: data.department,
            employeeId: data.employee_id,
            issueDate: data.issue_date,
            photoUrl: data.photo_url
        }
    };
}

// Update card status
export async function updateCardStatus(cardId: string, status: 'active' | 'revoked' | 'suspended') {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('id_cards')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', cardId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/id-cards');

    return { success: true };
}

// List all ID cards (admin only)
export async function listAllIdCards(filters?: {
    role?: string;
    status?: string;
    search?: string;
}) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            return { success: false, error: 'Unauthorized' };
        }

        const supabase = await createClient();

        console.log('Fetching ID cards with filters:', filters);

        let query = supabase
            .from('id_cards')
            .select(`
                *,
                user:users!user_id(full_name, email, role),
                template:id_card_templates(name, design_config)
            `);

        if (filters?.role) {
            query = query.eq('template_id', filters.role);
        }

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error listing ID cards:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            return { success: false, error: error.message };
        }

        // Filter by search term if provided
        let filteredData = data;
        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            filteredData = data.filter(card =>
                card.user.full_name.toLowerCase().includes(searchLower) ||
                card.card_number.toLowerCase().includes(searchLower) ||
                card.employee_id?.toLowerCase().includes(searchLower)
            );
        }

        return { success: true, data: filteredData };
    } catch (error: any) {
        console.error('Unexpected error in listAllIdCards:', error);
        return { success: false, error: error.message || 'An unexpected error occurred' };
    }
}

// Get card templates
export async function getCardTemplates() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('id_card_templates')
        .select('*')
        .eq('is_active', true)
        .order('role');

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

// Upload photo to storage
export async function uploadCardPhoto(file: File, userId: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `id-cards/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('id-cards')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        return { success: false, error: uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('id-cards')
        .getPublicUrl(filePath);

    return { success: true, data: publicUrl };
}

// Get users without ID cards
export async function getUsersWithoutCards() {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Get all users
    const { data: allUsers } = await supabase
        .from('users')
        .select('id, full_name, email, role')
        .in('role', ['associate', 'member'])
        .order('full_name');

    // Get users with active cards
    const { data: cardsData } = await supabase
        .from('id_cards')
        .select('user_id')
        .eq('status', 'active');

    const userIdsWithCards = new Set(cardsData?.map(c => c.user_id) || []);

    // Filter out users who already have cards
    const usersWithoutCards = allUsers?.filter(u => !userIdsWithCards.has(u.id)) || [];

    return { success: true, data: usersWithoutCards };
}

// Delete ID card
export async function deleteIdCard(cardId: string) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== 'admin') {
            return { success: false, error: 'Unauthorized' };
        }

        const supabase = await createClient();

        // 1. Get card to find photo URL for storage cleanup
        const { data: card } = await supabase
            .from('id_cards')
            .select('photo_url')
            .eq('id', cardId)
            .single();

        if (card?.photo_url) {
            try {
                // Extract file path from public URL
                // Format usually: https://.../id-cards/id-cards/userId-timestamp.ext
                const urlParts = card.photo_url.split('/id-cards/');
                if (urlParts.length > 1) {
                    const filePath = urlParts[urlParts.length - 1];
                    await supabase.storage.from('id-cards').remove([filePath]);
                }
            } catch (e) {
                console.error('Failed to delete photo from storage:', e);
            }
        }

        // 2. Delete the record (cascade will handle logs if set up, but let's be sure)
        const { error } = await supabase
            .from('id_cards')
            .delete()
            .eq('id', cardId);

        if (error) {
            throw error;
        }

        revalidatePath('/admin/id-cards');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting ID card:', error);
        return { success: false, error: error.message || 'Failed to delete ID card' };
    }
}
