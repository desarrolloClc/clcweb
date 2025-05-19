
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
import {

    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

export default function RegistroAsistencia({ ...props }) {
    const { registro, isEdit } = usePage().props
    // const [nombre, setNombre] = useState('');
  
    // console.log(registro);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isEdit ? 'Actualizar' : 'Registrar'} Asistencia`,
            href: route('asistencia.create'),
        },
    ];

    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Función para obtener los datos de la base de datos
        const fetchData = async () => {
            try {
                const response = await fetch('/cedulas-empleados'); // Cambia esta URL por la de tu API
                const data = await response.json();
                // console.log('data',data)
                // Transformamos los datos para que coincidan con el formato de react-select
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
        fecha: registro?.fecha || '',
        horaini: registro?.horaIni || '',
        horafin: registro?.horafin || '',
        justificacion: registro?.justificacion || '',
  
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();    
            console.log('data',data)            
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
            setData('cedula',value.label)
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
        }else{            
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
        setData('fecha', '');
        setData('horaini', '');
        setData('horafin', '');
        setData('justificacion', '');
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
                                    <InputError message={errors.cedula}/>
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
                                    <InputError message={errors.nombre}/>
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
                                    <InputError message={errors.cargo}/>
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
                                    <InputError message={errors.co}/>
                                </div>
                                  <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="fecha">Fecha</Label>
                                    <input
                                        id="fecha"
                                        name="fecha"
                                        type="date" 
                                        className="border-input file:text-foreground placeholder:text-muted-foreground border p-2 rounded-md"                                      
                                        value={data.fecha}
                                        onChange={(e) => setData('fecha', e.target.value)}
                                    />
                                    <InputError message={errors.fecha}/>
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
                                    <InputError message={errors.horaini}/>
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
                                    <InputError message={errors.horafin}/>
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
