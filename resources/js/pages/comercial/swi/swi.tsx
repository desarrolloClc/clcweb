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
import { Head, Link, router, useForm } from "@inertiajs/react";
import { CirclePlusIcon, Eye, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import * as XLSX from 'xlsx';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Swi',
        href: '/swi',
    },
];
interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}

interface Project {
    id: number;
    mes: string;
    ano: string;
    cod_empresa: string;
    nomb_empresa: string;
    cod_dep: string;
    nomb_dep: string;
    cod_municipio: string;
    nomb_municipio: string;
    grupo: string;
    zona: string;
    cant_vend_d_punto_vent_kg: number;
    cant_vend_tanq_D_kg: number;
    cant_tot_vend_min_k: number;
    granel: number;
    cilindros: number;
    suma: number;
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
    rows:[];
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}
const index = ({ records, filters, totalCount, filteredCount, rows }: IndexProps) => {
    //pagination
    const { data, setData } = useForm({
        search: filters.search || '',
        perPage: filters.perPage || '10',
    });

    // console.log(data) 
    console.log('datosIni', records.data)
    console.log('rows',rows)

    const exportToExcel = () => {
        const datosSinId = rows.map(({ id, ...resto }:any) => resto);
        const ws = XLSX.utils.json_to_sheet(datosSinId, {
            header: ['mes', 'ano', 'cod_empresa', 'nomb_empresa', 'cod_dep', 'nomb_dep', 'cod_municipio', 'nomb_municipio', 'grupo', 'zona', 'cant_vend_d_punto_vent_kg', 'cant_vend_tanq_D_kg', 'cant_tot_vend_min_k', 'granel', 'cilindros', 'suma'
            ], // Personaliza los encabezados
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Filtered Records');
        XLSX.writeFile(wb, 'filtered_records.xlsx');
    };

    const [year, setYear] = useState('2025');
    const [mesSui, setmesSui] = useState('');

    // Handle Change for the Search Input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // setData('search', value);

        const queryString = {
            ...(value && { search: value }),
            ...(year && { searchyear: year }),
            ...(mesSui && { searchmesSui: mesSui }),
            ...(data.perPage && { perPage: data.perPage }),
        };

        router.get(route('swi.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSelectChangeYear = (value: string) => {

        setYear(value)
        const queryString = {
            ...(value && { searchyear: value }),
            ...(data.perPage && { perPage: data.perPage }),
        };

        router.get(route('swi.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });

    }

    const handleSelectChangeMes = (value: string) => {

        setmesSui(value)
        const queryString = {
            ...(value && { searchmesSui: value }),
            ...(year && { searchyearMes: year }),
            ...(data.perPage && { perPage: data.perPage }),
        };

        router.get(route('swi.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });

    }

    const handleReset = () => {
        setData('search', '');
        //pagination
        setData('perPage', '10');
        setYear('2025');
        setmesSui('');
        const buscarElement = document.getElementById('buscar');
        if (buscarElement !== null) {
            (buscarElement as HTMLInputElement).value = '';
        }

        router.get(
            route('swi.index'),
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

        router.get(route('swi.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Swi Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Search inputs and button */}
                <div className=" flex w-full items-center justify-between ">

                    <Input
                        type="text"
                        // value={data.search}
                        onChange={handleChange}
                        className="h-10 w-125 border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        placeholder="Buscar ..."
                        name="search"
                        id="buscar"
                    />

                    <Button onClick={handleReset} 
                    className="flex items-center justify-center h-10 w-30 cursor-pointer bg-gray-700 text-white  hover:bg-indigo-900 rounded">
                        Borrar filtros
                    </Button>

                                    
                     <div className="flex flex-col space-y-1.5 mb-3">
                            <Label htmlFor="framework">Año</Label>
                            <Select onValueChange={handleSelectChangeYear} value={year} >
                                <SelectTrigger id="framework">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="2015">2015</SelectItem>
                                    <SelectItem value="2016">2016</SelectItem>
                                    <SelectItem value="2017">2017</SelectItem>
                                    <SelectItem value="2018">2018</SelectItem>
                                    <SelectItem value="2019">2019</SelectItem>
                                    <SelectItem value="2020">2020</SelectItem>
                                    <SelectItem value="2021">2021</SelectItem>
                                    <SelectItem value="2022">2022</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2025">2025</SelectItem>
                                </SelectContent>
                            </Select>

                        </div>                    
                  
                        <div className="flex flex-col space-y-1.5 mb-3">
                            <Label htmlFor="framework">Mes</Label>
                            <Select onValueChange={handleSelectChangeMes} value={mesSui} >
                                <SelectTrigger id="framework">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="Ene">Ene</SelectItem>
                                    <SelectItem value="Feb">Feb</SelectItem>
                                    <SelectItem value="Mar">Mar</SelectItem>
                                    <SelectItem value="Abr">Abr</SelectItem>
                                    <SelectItem value="May">May</SelectItem>
                                    <SelectItem value="Jun">Jun</SelectItem>
                                    <SelectItem value="Jul">Jul</SelectItem>
                                    <SelectItem value="Ago">Ago</SelectItem>
                                    <SelectItem value="Sep">Sep</SelectItem>
                                    <SelectItem value="Oct">Oct</SelectItem>
                                    <SelectItem value="Nov">Nov</SelectItem>
                                    <SelectItem value="Dic">Dic</SelectItem>
                                </SelectContent>
                            </Select>

                        </div>
                  
                    <button className='bg-lime-700 text-white w-50 p-2 rounded-md font-black cursor-pointer' onClick={exportToExcel}>
                        Exportar a Excel
                    </button>
                </div>
    
                <div className="overflow-scroll rounded-lg border bg-white shadow-sm">
                    <h1 className="text-2xl text-center mb-2 mt-2">Datos de la bd</h1>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-pink-600 text-white">
                                {/* <th className="w-25 border p-2">#</th> */}
                                <th className="w-25 border p-2">Mes</th>
                                <th className="w-25 border p-2">Año</th>
                                <th className="border p-2">Cod. Empresa</th>
                                <th className="border p-2">Empresa</th>
                                <th className="border p-2">Cod. Dep</th>
                                <th className="border p-2">Departamento</th>
                                <th className="border p-2">Cod. Municipio</th>
                                <th className="border p-2">Municipio</th>
                                <th className="border p-2">grupo</th>
                                <th className="border p-2">Zona</th>
                                <th className="border p-2">Venta_punto_venta_kg</th>
                                <th className="border p-2">Venta_tanque_kg</th>
                                <th className="border p-2">Venta_minorista_kg</th>
                                <th className="border p-2">Granel</th>
                                <th className="border p-2">Cilindros</th>
                                <th className="border p-2">Suma</th>

                            </tr>
                        </thead>

                        <tbody>
                            {records.data.length > 0 ? (
                                records.data.map((record, index) => (
                                    <tr key={index}>
                                        {/* <td className="border px-4 py-2 text-center">{record.id}</td> */}
                                        <td className="border px-4 py-2 text-center">{record.mes} </td>
                                        <td className="border px-4 py-2 text-center">{record.ano} </td>
                                        <td className="border px-4 py-2 text-center">{record.cod_empresa} </td>
                                        <td className="border px-4 py-2 text-center">{record.nomb_empresa}</td>
                                        <td className="border px-4 py-2 text-center">{record.cod_dep} </td>
                                        <td className="border px-4 py-2 text-center">{record.nomb_dep} </td>
                                        <td className="border px-4 py-2 text-center">{record.cod_municipio}</td>
                                        <td className="border px-4 py-2 text-center">{record.nomb_municipio}</td>
                                        <td className="border px-4 py-2 text-center">{record.grupo}</td>
                                        <td className="border px-4 py-2 text-center">{record.zona}</td>
                                        <td className="border px-4 py-2 text-center">{record.cant_vend_d_punto_vent_kg} </td>
                                        <td className="border px-4 py-2 text-center">{record.cant_vend_tanq_D_kg} </td>
                                        <td className="border px-4 py-2 text-center">{record.cant_tot_vend_min_k}</td>
                                        <td className="border px-4 py-2 text-center">{record.granel}</td>
                                        <td className="border px-4 py-2 text-center">{record.cilindros}</td>
                                        <td className="border px-4 py-2 text-center">{record.suma}</td>
                                        {/* <td className="w-40 border px-4 py-2 text-center"> */}
                                        {/* <Link
                                                as="button"
                                                className="cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90"
                                                href={route('projects.show', record.id)}
                                            >
                                                <Eye size={18} />{' '}
                                            </Link> */}

                                        {/* <Link
                                                as="button"
                                                className="ms-2 cursor-pointer rounded-lg  bg-blue-600 p-2 text-white hover:opacity-90"
                                                href={route('projects.edit', record.id)}
                                            >
                                                <Pencil size={18} />{' '}
                                            </Link> */}

                                        {/* <Button
                                                className="ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this project?')) {
                                                        // router.delete(route('projects.destroy', record.id), {
                                                        //     preserveScroll: true,
                                                        // });
                                                    }
                                                }}
                                            >
                                                <Trash2 size={18} />{' '}
                                            </Button>
                                        </td> */}
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