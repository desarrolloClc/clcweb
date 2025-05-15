import { Pagination } from "@/components/ui/pagination";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Button, Input } from "@headlessui/react";
import { Head,Link, router,useForm } from "@inertiajs/react";
import { CirclePlusIcon, Eye, Pencil, Trash2, X } from "lucide-react";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Proyectos',
        href: '/projects',
    },
];
interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}

interface Project {
    id: number;
    name: string;
    description: string;
    price: number;
    featured_image: string;
    featured_image_original_name: string;
    created_at: string;
}

interface ProjectPagination {
    data: Project[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface FilterProps {
    search: string;
    perPage: string;
}

interface IndexProps {
    projects: ProjectPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}
const index = ({projects,filters, totalCount, filteredCount}: IndexProps) => {
     //pagination
    const { data, setData } = useForm({
        search: filters.search || '',
        perPage: filters.perPage || '10',
    });
    
    console.log(data)
    // Handle Change for the Search Input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // setData('search', value);

        const queryString = {
            ...(value && { search: value }),
            ...(data.perPage && { perPage: data.perPage }),
        };

        router.get(route('projects.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // To Reset Applied Filter
    const handleReset = () => {
        setData('search', '');
        //pagination
        setData('perPage', '10');

        router.get(
            route('projects.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Handle Per Page Change
    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        const queryString = {
            ...(data.search && { search: data.search }),
            ...(value && { perPage: value }),
        };

        router.get(route('products.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Project Management" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
              {/* Search inputs and button */}
              <div className="mb-4 flex w-full items-center justify-between gap-4">
                    <Input
                        type="text"
                        // value={data.search}
                        onChange={handleChange}
                        className="h-10 w-1/3 border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        placeholder="Buscar ..."
                        name="search"
                    />

                    <Button onClick={handleReset}  className="flex items-center justify-center h-10 w-10 cursor-pointer bg-gray-700 text-white place-content-center hover:bg-red-500 rounded">
                        <X size={20} />
                    </Button>

                    {/* Add Project button */}
                    <div className="ml-auto">
                        <Link
                            className="text-md flex cursor-pointer items-center rounded-lg bg-pink-600 px-4 py-2 text-white hover:opacity-90"
                            type="button"
                            href={route('projects.create')}
                        >
                            <CirclePlusIcon className="me-2" /> Nuevo
                        </Link>
                    </div>
                </div>
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-pink-600 text-white">
                                <th className="border p-4">#</th>
                                <th className="border p-4">Name</th>
                                <th className="w-90 border p-4">Description</th>                        
                                <th className="border p-4">Created Date</th>
                                <th className="border p-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.data.length > 0 ? (
                                projects.data.map((project, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2 text-center">{project.id}</td>
                                        <td className="border px-4 py-2 text-center">{project.name} </td>
                                        <td className="border px-4 py-2 text-center">{project.framework} </td>                                    
                                        <td className="border px-4 py-2 text-center">{project.created_at}</td>
                                        <td className="w-40 border px-4 py-2 text-center">
                                            <Link
                                                as="button"
                                                className="cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90"
                                                href={route('projects.show', project.id)}
                                            >
                                                <Eye size={18} />{' '}
                                            </Link>

                                            <Link
                                                as="button"
                                                className="ms-2 cursor-pointer rounded-lg  bg-blue-600 p-2 text-white hover:opacity-90"
                                                href={route('projects.edit', project.id)}
                                            >
                                                <Pencil size={18} />{' '}
                                            </Link>

                                            <Button
                                                className="ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this project?')) {
                                                        router.delete(route('projects.destroy', project.id), {
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                            >
                                                <Trash2 size={18} />{' '}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-md py-4 text-center font-bold text-red-600">
                                        No projects Found!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>  
                {/* Pagination */}
                <Pagination projects={projects} perPage={data.perPage} onPerPageChange={handlePerPageChange} totalCount={totalCount} filteredCount={filteredCount} search={data.search}  />
        </div>
    </AppLayout>
  )
}

export default index