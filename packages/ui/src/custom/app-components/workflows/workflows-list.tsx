import { cn } from "../../../utils";
import { I18nComponent } from "@kit/i18n"
import { WorkflowCard } from "./workflow-card"


export default function WorkflowsPage() {

    const apiData = {
        icon: "Cloud",
        requests: 1234,
        uptime: "99.99%",
    }
  
    const categories = [
        { name: "API", icon: "Cloud" },
        { name: "Social", icon: "Placeholder" },
    ]
  
    const cards = Array.from({ length: Math.floor(Math.random() * 5) + 10 }, () => {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        return {
            name: randomCategory?.name,
            icon: randomCategory?.icon,
            requests: Math.floor(Math.random() * 10000),
            uptime: (95 + Math.random() * 5).toFixed(2) + "%",
            id: Math.floor(Math.random() * 10000),
        };
    });
  
    return (
        <div className="flex flex-col gap-4 items-center">
            <div className={cn('border-b py-8 xl:py-10 2xl:py-12')}>
                <div className={'container flex flex-col space-y-2 lg:space-y-4'}>
                    <h1
                    className={
                        'font-heading text-3xl font-medium tracking-tighter dark:text-white xl:text-5xl'
                    }
                    >
                        <I18nComponent i18nKey="edgen:workflowsTitle" className="text-2xl font-bold" />
                    </h1>
  
                    <h2
                    className={
                        'text-lg tracking-tight text-muted-foreground 2xl:text-2xl'
                    }
                    >           
                        <I18nComponent i18nKey="edgen:workflowsDescription" className="text-sm text-muted-foreground" />
                    </h2>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-6 p-6">
                {cards.map((card, index) => (
                    <WorkflowCard key={index} name={card.name} requests={card.requests} uptime={card.uptime} id={card.id} />
                ))}
            </div>
        </div>
    )
  }