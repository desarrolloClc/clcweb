
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage,useForm, Link } from '@inertiajs/react';
import axios from "axios"
import { useState } from "react"
import {  } from "react-hook-form"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Medidores',
        href: '/projects',
    },
];

export default function Medidores({ ...props }) {
    const { project,isEdit  } = usePage().props
    // const [nombre, setNombre] = useState('');
    // console.log(props);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${ isEdit ? 'Update' : 'Create'} Project`,
            href:route('projects.create'),
        },
    ];

    const{data, setData,post,put,processing,errors,reset} = useForm({
        name: project?.name || '',      
        framework:project?.framework || '', 
       
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();    
        // const name = document.getElementById('name')?.value
        // const sel = document.getElementById('framework')?.textContent
  
        // if(name =='' && sel=='Select'){
        //     alert('campos vacios!')
        //     return
        // }
        // console.log(name)
        // console.log(sel)
        if (isEdit) {
            console.log(project)
            put(route('projects.update', project.id), {
                // forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('projects.store'), {
                onSuccess: () => reset(),
            });
        }
        // post(route('projects.store'),{
        //     onSuccess:()=>console.log('data enviada')
        // })

        console.log('data',data)
        // const camposVacios = Object.entries(data).filter(([clave, valor]) => {
        //     return valor === null || valor === undefined || valor === '';
        //   });
          
        //   if (camposVacios.length > 0) {
        //     alert("Hay campos vacíos:");
        //   } else {
        //    console.log("Todo está completo ✅");
        //   }
    }
    const handlechange =(value)=>{
        // setData('framework',value)
        console.log(value)
        // const sel = document.getElementById('framework')?.textContent
        // setData('framework',sel);
        //  console.log(sel)
        axios.get('/framework', {params: {
            proy: value  // Solo usuarios activos
                // Edad mínima de 18 años
        }})
        .then(function (response) {
            // manejar respuesta exitosa
            console.log(response.data)
            setData('name',response.data.response[0].name);
            setData('framework',response.data.response[0].framework);
          })
          .catch(function (error) {
            // manejar error
            console.log(error);
          })
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Medidores" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 mx-auto">
                <Card className="md:w-[850px] mt-3">
                    <CardHeader>
                        <CardTitle>{ `${ isEdit ? 'Update' : 'Create'} Project`} </CardTitle>
                        <CardDescription>Deploy your new project in one-click.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="grid  grid-cols w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Name</Label>                                  
                                    <Input 
                                    id="name" 
                                    name="name"
                                    placeholder="Name of your project"
                                    className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    value={data.name}
                                    onChange={(e) => setData('name',e.target.value)}
                                    />
                                    <InputError message={errors.name}/>
                                </div>
                              
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="framework">Framework-{data.framework}</Label>
                                    <Select onValueChange={handlechange} value={data.framework} >
                                        <SelectTrigger id="framework">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="Next.js">Next.js</SelectItem>
                                            <SelectItem value="SvelteKit">SvelteKit</SelectItem>
                                            <SelectItem value="Astro">Astro</SelectItem>
                                            <SelectItem value="Nuxt.js">Nuxt.js</SelectItem>
                                        </SelectContent>
                                    </Select>
                           
                                    <InputError message={errors.framework}/>
                                </div>
                               
                            </div>
                            <CardFooter className="flex justify-between mt-3">
                                    <Link
                                     type="button" href={route('projects.index')} 
                                     className="p-2 rounded-md border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
                                     >Cancel</Link>
                                    <Button type="submit">Guardar</Button>
                                </CardFooter>
                        </form>
                    </CardContent>

                </Card>
            </div>
        </AppLayout>
    );
}
