import NewProjectForm from '@/components/admin/NewProjectForm';
import { getUsersByRoles } from '@/app/actions/users';

export default async function NewProjectPage() {
    const result = await getUsersByRoles(['associate', 'member']);
    const users = result.success ? (result.data || []) : [];

    const associates = users.filter((u: any) => u.role === 'associate');
    const members = users.filter((u: any) => u.role === 'member');

    return (
        <div className="min-h-full">
            <NewProjectForm associates={associates} members={members} />
        </div>
    );
}
