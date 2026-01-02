"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {subjects} from "@/constants";
import {Textarea} from "@/components/ui/textarea";
import {createCompanion} from "@/lib/actions/companion.actions";
import {redirect} from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, { message: 'Companion is required.'}),
    subject: z.string().min(1, { message: 'Subject is required.'}),
    topic: z.string().min(1, { message: 'Topic is required.'}),
    voice: z.string().min(1, { message: 'Voice is required.'}),
    style: z.string().min(1, { message: 'Style is required.'}),
    duration: z.coerce.number().min(1, { message: 'Duration is required.'}),
})

const CompanionForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            subject: '',
            topic: '',
            voice: '',
            style: '',
            duration: 15,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const companion = await createCompanion(values);

        if(companion) {
            redirect(`/companions/${companion.id}`);
        } else {
            console.log('Failed to create a companion');
            redirect('/');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold text-foreground">Companion Name</FormLabel>
                                <FormDescription className="text-sm text-foreground-muted mb-2">
                                    Give your companion a unique, memorable name
                                </FormDescription>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., AI Prof, Math Master, Code Mentor"
                                        {...field}
                                        className="input h-11 rounded-lg bg-card border border-border text-foreground placeholder:text-foreground-muted/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-5">
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold text-foreground">Subject</FormLabel>
                                <FormDescription className="text-sm text-foreground-muted mb-2">
                                    Choose the primary subject your companion will teach
                                </FormDescription>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="input h-11 rounded-lg bg-card border border-border text-foreground capitalize focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20">
                                            <SelectValue placeholder="Select the subject" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border border-border rounded-lg">
                                            {subjects.map((subject) => (
                                                <SelectItem
                                                    value={subject}
                                                    key={subject}
                                                    className="capitalize cursor-pointer hover:bg-primary/10"
                                                >
                                                    {subject}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-5">
                    <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold text-foreground">What should the companion teach?</FormLabel>
                                <FormDescription className="text-sm text-foreground-muted mb-2">
                                    Describe the topics, concepts, or skills in detail
                                </FormDescription>
                                <FormControl>
                                    <Textarea
                                        placeholder="Ex. Introduction to Agentic AI, Neural Networks Basics, Prompt Engineering Techniques"
                                        {...field}
                                        className="input rounded-lg bg-card border border-border text-foreground placeholder:text-foreground-muted/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 min-h-24 resize-none"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="voice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold text-foreground">Voice</FormLabel>
                                <FormDescription className="text-xs text-foreground-muted mb-2">
                                    Voice type
                                </FormDescription>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="input h-11 rounded-lg bg-card border border-border text-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20">
                                            <SelectValue
                                                placeholder="Select voice"
                                            />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border border-border rounded-lg">
                                            <SelectItem value="male" className="cursor-pointer hover:bg-primary/10">
                                                Male
                                            </SelectItem>
                                            <SelectItem value="female" className="cursor-pointer hover:bg-primary/10">
                                                Female
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold text-foreground">Style</FormLabel>
                                <FormDescription className="text-xs text-foreground-muted mb-2">
                                    Teaching style
                                </FormDescription>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="input h-11 rounded-lg bg-card border border-border text-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20">
                                            <SelectValue
                                                placeholder="Select style"
                                            />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border border-border rounded-lg">
                                            <SelectItem value="formal" className="cursor-pointer hover:bg-primary/10">
                                                Formal
                                            </SelectItem>
                                            <SelectItem value="casual" className="cursor-pointer hover:bg-primary/10">
                                                Casual
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-5">
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold text-foreground">Session Duration</FormLabel>
                                <FormDescription className="text-sm text-foreground-muted mb-2">
                                    Estimated duration in minutes
                                </FormDescription>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="15"
                                        {...field}
                                        className="input h-11 rounded-lg bg-card border border-border text-foreground placeholder:text-foreground-muted/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                        )}
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full h-12 mt-8 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg active:scale-95"
                >
                    Build Your Companion
                </button>
            </form>
        </Form>
    )
}

export default CompanionForm
