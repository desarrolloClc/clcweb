import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Button, Input } from "@headlessui/react";
import { Head,Link, router,useForm } from "@inertiajs/react";
import { CirclePlusIcon, Eye, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Asistencia',
        href: '/asistencia',
    },
];
interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}

interface Project {
    id: number;
    cedula: string;
    nombre: string;
    cargo: string;
    co: string;
    fecha: string;
    horaini: string;
    horafin: string;    
    justificacion: string;  
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
    records: ProjectPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}
const index = ({records,filters, totalCount, filteredCount}: IndexProps) => {
     //pagination
    const { data, setData } = useForm({
        search: filters.search || '',
        perPage: filters.perPage || '10',
    });
    
    // console.log(data) 
    console.log(records.data)
 
    // Handle Change for the Search Input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;       

        const queryString = {
            ...(value && { search: value }),        
            ...(data.perPage && { perPage: data.perPage }),
        };

        router.get(route('asistencia.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };



    const handleReset = () => {
        setData('search', '');
        //pagination
        setData('perPage', '10');
        const buscarElement = document.getElementById('buscar');
        if (buscarElement !== null) {
        (buscarElement as HTMLInputElement).value = '';
        }
        router.get(
            route('asistencia.index'),
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

        router.get(route('asistencia.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Swi Management" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                         
                  <div className="mb-4 flex w-full items-center justify-between gap-4">
                    <Input
                        type="text"
                        // value={data.search}
                        onChange={handleChange}
                        className="h-10 w-1/3 border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        placeholder="Buscar ..."
                        name="search"
                        id="buscar"
                    />

                    <Button onClick={handleReset}  className="flex items-center justify-center h-10 w-10 cursor-pointer bg-gray-700 text-white place-content-center hover:bg-red-500 rounded">
                        <X size={20} />
                    </Button>

                    {/* Add Project button */}
                    <div className="ml-auto">
                        <Link
                            className="text-md flex cursor-pointer items-center rounded-lg bg-gray-700 px-4 py-2 text-white hover:opacity-90"
                            type="button"
                            href={route('asistencia.create')}
                        >
                            <CirclePlusIcon className="me-2" /> Nuevo
                        </Link>
                    </div>
                </div>
                <div className="overflow-scroll rounded-lg border bg-white shadow-sm">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-pink-600 text-white">                            
                                <th className="w-25 border p-2">Cedula</th>
                                <th className="w-25 border p-2">Nombre</th>
                                <th className="w-25 border p-2">Cargo</th>
                                <th className="w-25 border p-2">Centro Op.</th>
                                <th className="w-30 border p-2">Fecha</th>                        
                                <th className="w-20 border p-2">Hora inicio</th>
                                <th className="w-20 border p-2">Hora fin</th>
                                <th className="border p-2">Justificacion</th> 
                                <th className="border p-2">Acciones</th>                                                         
                            </tr>
                        </thead>

                        <tbody>
                            {records.data.length > 0 ? (
                                records.data.map((record, index) => (
                                    <tr key={index}>
                                        {/* <td className="border px-4 py-2 text-center">{record.id}</td> */}
                                        <td className="border px-4 py-2 text-center">{record.cedula} </td>
                                        <td className="border px-4 py-2 text-center">{record.nombre} </td>
                                        <td className="border px-4 py-2 text-center">{record.cargo} </td>
                                        <td className="border px-4 py-2 text-center">{record.co} </td>
                                        <td className="border px-4 py-2 text-center">{record.fecha} </td>
                                        <td className="border px-4 py-2 text-center">{record.horaini} </td>                                    
                                        <td className="border px-4 py-2 text-center">{record.horafin}</td>
                                        <td className="border px-4 py-2 text-center">{record.justificacion} </td>    
                                   
                                        <td className="w-40 border px-4 py-2 text-center">
                                            {/* <Link
                                                as="button"
                                                className="cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90"
                                                href={route('projects.show', record.id)}
                                            >
                                                <Eye size={18} />{' '}
                                            </Link> */}

                                            <Link
                                                as="button"
                                                className="ms-2 cursor-pointer rounded-lg  bg-blue-900 p-2 text-white hover:opacity-90"
                                                href={route('asistencia.edit', record.id)}
                                            >
                                                <Pencil size={18} />{' '}
                                            </Link>

                                            <Button
                                                className="ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90"
                                                onClick={() => {
                                                    if (confirm('Esta seguro/a de borrar este registro?')) {
                                                        router.delete(route('asistencia.destroy', record.id), {
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
                                    <td colSpan={16} className="text-md py-4 text-center font-bold ">
                                        No se encontraron datos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>  
                {/* Pagination */}
                <Pagination projects={records} perPage={data.perPage} onPerPageChange={handlePerPageChange} totalCount={totalCount} filteredCount={filteredCount} search={data.search}  />
        </div>
    </AppLayout>
  )
}

export default index