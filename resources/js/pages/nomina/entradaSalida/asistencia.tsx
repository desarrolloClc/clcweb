import { Pagination } from "@/components/ui/pagination";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Button, Input } from "@headlessui/react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { CirclePlusIcon, Eye, Pencil, Trash2, X } from "lucide-react";
import * as XLSX from 'xlsx';


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
    fechaIn: string;
    fechaSal: string;
    horaini: string;
    horafin: string;
    justificacion: string;
    Reduccion_HJL: string;
    tiempo_break: string;

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
     rows:[];
}
const index = ({ records, filters, totalCount, filteredCount,rows }: IndexProps) => {
    // const {auth} = usePage().props
    // console.log('cedula',auth.user.cedula)
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

    const exportToExcel = () => {
        const datosSinId = rows.map(({ id, updated_at,...resto }: any) => resto);
        const datosFilter = datosSinId.map(dato=>{
            dato.created_at = dato.created_at.slice(0,10);
          
            return dato
        })
        const datosExport = datosFilter.map(item => ({         
          "Cedula":item.cedula,
          "Nombre":item.nombre,
          "Cargo":item.cargo,
          "Centro Op.":item.co,
          "Fecha Ingreso":item.fechaIn,
          "Fecha Salida":item.fechaSal,
          "Hora Ingreso":item.horaini,
          "Hora Salida":item.horafin,
          "Justificacion":item.justificacion,          
          "Tiempo Break":item.tiempo_break,
          "Reduccion HJL":item.Reduccion_HJL,
          "Fecha de registro":item.created_at
        }))
        const ws = XLSX.utils.json_to_sheet(datosExport);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Filtered Records');
        XLSX.writeFile(wb, 'Listado.xlsx');
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

                    <Button onClick={handleReset} className="flex items-center justify-center h-10 w-10 cursor-pointer bg-gray-700 text-white place-content-center hover:bg-red-500 rounded">
                        <X size={20} />
                    </Button>

                    <button className='uppercase bg-lime-700 text-white w-50 p-2 rounded-md font-black cursor-pointer' onClick={exportToExcel}>
                        Exportar a Excel
                    </button>
                    <div className="ml-auto">
                        <Link
                            className="uppercase text-md flex cursor-pointer items-center rounded-lg bg-gray-700 px-4 py-2 text-white hover:opacity-90"
                            type="button"
                            href={route('asistencia.create')}
                        >
                            <CirclePlusIcon className="me-2 " /> Nuevo
                        </Link>
                    </div>
                </div>
                <div className="overflow-scroll rounded-lg border bg-white shadow-sm">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-pink-600 text-white">
                                <th className="w-25 border p-2 uppercase">Cédula</th>
                                <th className="w-25 border p-2 uppercase">Nombre</th>
                                <th className="w-25 border p-2 uppercase">Cargo</th>
                                <th className="w-25 border p-2 uppercase">Centro Op.</th>
                                <th className="w-30 border p-2 uppercase">Fecha Ingreso</th>
                                <th className="w-30 border p-2 uppercase">Fecha Salida</th>
                                <th className="w-20 border p-2 uppercase">Hora Ingreso</th>
                                <th className="w-20 border p-2 uppercase">Hora Salida</th>
                                <th className="border p-2 uppercase">Justificacion</th>
                                <th className="border p-2 uppercase">Tiempo break</th>
                                <th className="border p-2 uppercase">Reduccion HJL</th>
                                <th className="w-50 border p-2 uppercase">Acciones</th>
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
                                        <td className="border px-4 py-2 text-center">{record.fechaIn} </td>
                                        <td className="border px-4 py-2 text-center">{record.fechaSal} </td>
                                        <td className="border px-4 py-2 text-center">{record.horaini} </td>
                                        <td className="border px-4 py-2 text-center">{record.horafin}</td>
                                        <td className="border px-4 py-2 text-center">{record.justificacion} </td>
                                        <td className="border px-4 py-2 text-center">{record.tiempo_break} </td>
                                        <td className="border px-4 py-2 text-center">{record.Reduccion_HJL} </td>

                                        <td className="w-80 border px-4 py-2 text-center">
                                            {/* <Link
                                                as="button"
                                                className="cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90"
                                                href={route('projects.show', record.id)}
                                            >
                                                <Eye size={18} />{' '}
                                            </Link> */}
                                            <div className="flex">
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
                                            </div>
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
                <Pagination projects={records} perPage={data.perPage} onPerPageChange={handlePerPageChange} totalCount={totalCount} filteredCount={filteredCount} search={data.search} />
            </div>
        </AppLayout>
    )
}

export default index