
import InputError from "@/components/input-error"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import Select from 'react-select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import axios from "axios"
import { useEffect, useState } from "react"
import { } from "react-hook-form"

interface Option {
    value: string;
    label: string;
}

export default function RegistroAsistencia() {
    const { registro, isEdit, auth } = usePage().props
    const co = auth.user.co
    console.log('centro op', co)

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Actualizar' : 'Registrar'} Asistencia`,
            href: route('asistencia.create'),
        },
    ];

    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

      const opcionesTime = [
        { value: 0.25, label: '15 min' },
        { value: 0.5, label: '30 min' },
        { value: 0.75, label: '45 min' },
        { value: 1, label: '60 min' },
        { value: 1.25, label: '75 min' },
        { value: 1.5, label: '90 min' },
        { value: 1.75, label: '105 min' },
        { value: 2, label: '120 min' },
  ];

    useEffect(() => {
       
        const fetchData = async () => {
            try {
                const response = await fetch(`/cedulas-empleados/${co}`); 
                const data = await response.json();
                // console.log('data',data)
              
                const optionsData = data.response.map((item: any) => ({
                    value: item.id,
                    label: item.cedula
                }));

                setOptions(optionsData);
                //  console.log('data',optionsData)
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        cedula: registro?.cedula || '',
        nombre: registro?.nombre || '',
        cargo: registro?.cargo || '',
        co: registro?.co || '',
        fechaIn: registro?.fechaIn || '',
        fechaSal: registro?.fechaSal || '',
        horaini: registro?.horaini || '',
        horafin: registro?.horafin || '',
        justificacion: registro?.justificacion || '',
        tiempo_break: registro?.tiempo_break || '',
        Reduccion_HJL: registro?.Reduccion_HJL || '',

    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('data', data)
        if (isEdit) {
            console.log(registro)
            put(route('asistencia.update', registro.id), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('asistencia.store'), {
                onSuccess: () => reset(),
            });
        }



    }
   
    const selectedCed = (value: any) => {
        // console.log(value == null?'llego vacio':'lleno') 
        if (value != null) {
            console.log(value.label)
            setData('cedula', value.label)
            axios.get('/cedula-empleado', {
                params: {
                    ced: value.label
                }
            })
                .then(function (response) {
                    // manejar respuesta exitosa
                    console.log(response.data.response[0].nombre)
                    setData('nombre', response.data.response[0].nombre);
                    setData('cargo', response.data.response[0].cargo);
                    setData('co', response.data.response[0].co);
                })
                .catch(function (error) {
                    // manejar error
                    console.log(error);
                })
        } else {
            setData('nombre', '');
            setData('cargo', '');
            setData('co', '');
            // setData('fecha', '');
            // setData('horaini', '');
            // setData('horafin', '');
            // setData('justificacion', '');
        }
    }

    const resetFormulario = () => {
        setData('nombre', '');
        setData('cargo', '');
        setData('co', '');
        setData('fechaIn', '');
        setData('fechaSal', '');
        setData('horaini', '');
        setData('horafin', '');
        setData('justificacion', '');
        setData('Reduccion_HJL', '');
        setData('tiempo_break', '');
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Medidores" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 mx-auto">
                <Card className="md:w-[850px] mt-3">
                    <CardHeader>
                        <CardTitle className="text-2xl">{`${isEdit ? 'Actualizar' : 'Registrar'} Asistencia`} </CardTitle>
                        <CardDescription>{`${isEdit ? 'Actualiza' : 'Registra'} tu asistencia`}</CardDescription>
                    </CardHeader>
                    <CardContent>

                        <form onSubmit={handleSubmit}>
                            <div className="grid  grid-cols-2 w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <h3>Selecciona tu cédula</h3>
                                    {loading ? (
                                        <p>Cargando...</p>
                                    ) : (
                                        <Select
                                            options={options}
                                            onChange={selectedCed}
                                            value={options.find(option => option.label === data.cedula) || null}
                                            placeholder="Busca y selecciona..."
                                            id="cedula"
                                            name="cedula"
                                            isClearable
                                        />
                                    )}
                                    <InputError message={errors.cedula} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        name="nombre"
                                        placeholder="Nombre"
                                        className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                    />
                                    <InputError message={errors.nombre} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="cargo">Cargo</Label>
                                    <Input
                                        id="cargo"
                                        name="cargo"
                                        placeholder="Cargo"
                                        value={data.cargo}
                                        onChange={(e) => setData('cargo', e.target.value)}
                                    />
                                    <InputError message={errors.cargo} />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="co">Centro Operativo</Label>
                                    <Input
                                        id="co"
                                        name="co"
                                        placeholder="Centro Operativo"
                                        value={data.co}
                                        onChange={(e) => setData('co', e.target.value)}
                                    />
                                    <InputError message={errors.co} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="fechaIn">Fecha Ingreso</Label>
                                    <input
                                        id="fechaIn"
                                        name="fechaIn"
                                        type="date"
                                        className="border-input file:text-foreground placeholder:text-muted-foreground border p-2 rounded-md"
                                        value={data.fechaIn}
                                        onChange={(e) => setData('fechaIn', e.target.value)}
                                    />
                                    <InputError message={errors.fechaIn} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="fechaSal">Fecha Salida</Label>
                                    <input
                                        id="fechaSal"
                                        name="fechaSal"
                                        type="date" 
                                        className="border-input file:text-foreground placeholder:text-muted-foreground border p-2 rounded-md"                                      
                                        value={data.fechaSal}
                                        onChange={(e) => setData('fechaSal', e.target.value)}
                                    />
                                    <InputError message={errors.fechaSal}/>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="horaini">Hora Inicio</Label>
                                    <input
                                        id="horaini"
                                        name="horaini"
                                        type="time"
                                        className="border-input file:text-foreground placeholder:text-muted-foreground border p-2 rounded-md"
                                        value={data.horaini}
                                        onChange={(e) => setData('horaini', e.target.value)}
                                    />
                                    <InputError message={errors.horaini} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="horafin">Hora Fin</Label>
                                    <input
                                        id="horafin"
                                        name="horafin"
                                        type="time"
                                        className="border-input file:text-foreground placeholder:text-muted-foreground border p-2 rounded-md"
                                        value={data.horafin}
                                        onChange={(e) => setData('horafin', e.target.value)}
                                    />
                                    <InputError message={errors.horafin} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <h3>Tiempo break</h3>
                                    {loading ? (
                                        <p>Cargando...</p>
                                    ) : (
                                        <Select
                                            options={opcionesTime}
                                            onChange={e=> setData('tiempo_break',e?.value)}
                                            value={opcionesTime.find(option => option.value === Number(data.tiempo_break)) || null}
                                            placeholder="Selecciona..."
                                            id="break"
                                            name="break"
                                            isClearable
                                        />
                                    )}
                                    <InputError message={errors.tiempo_break} />
                                </div>
                                 <div className="flex flex-col space-y-1.5">
                                    <h3>Reduccion HJL</h3>
                                    {loading ? (
                                        <p>Cargando...</p>
                                    ) : (
                                        <Select
                                            options={opcionesTime}
                                            onChange={e=> setData('Reduccion_HJL',e?.value)}
                                            value={opcionesTime.find(option => option.value === Number(data.Reduccion_HJL)) || null}
                                            placeholder="Selecciona..."
                                            id="redhjl"
                                            name="redhjl"
                                            isClearable
                                        />
                                    )}
                                    <InputError message={errors.Reduccion_HJL} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="justificacion">Justificación</Label>
                                    <textarea
                                        id="justificacion"
                                        name="justificacion"
                                        placeholder="Justificación"
                                        rows={3}
                                        className="border-input file:text-foreground placeholder:text-muted-foreground border p-2 rounded-md"
                                        value={data.justificacion}
                                        onChange={(e) => setData('justificacion', e.target.value)}
                                    />
                                    {/* <InputError message={errors.justificacion}/> */}
                                </div>


                            </div>
                            <CardFooter className="flex justify-start gap-2 mt-3">
                                <Link
                                    type="button" href={route('asistencia.index')}
                                    className="p-2 px-5 rounded-md border border-input shadow-xs text-white bg-gray-700 hover:bg-gray-900"
                                >Atras</Link>
                                <Button
                                    type="button"
                                    onClick={resetFormulario}
                                    className="bg-gray-100 hover:bg-gray-200 text-black"
                                >Limpiar</Button>
                                <Button
                                    type="submit"
                                    className=" hover:bg-pink-600 "
                                >
                                    {`${isEdit ? 'Actualizar' : 'Guardar'}`}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>

                </Card>
            </div>
        </AppLayout>
    );
}
