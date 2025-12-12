import { cn } from "@/lib/utils";

interface InfoCardProps {
    title: string;
    value: string | number;
    icon?: React.ElementType;
    trend?: string;
    trendUp?: boolean;
    className?: string;
}

export default function InfoCard({ title, value, icon: Icon, trend, trendUp, className }: InfoCardProps) {
    return (
        <div className={cn("bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">{value}</h3>
                </div>
                {Icon && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                )}
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={cn(
                        "font-medium",
                        trendUp ? "text-green-600" : "text-red-600"
                    )}>
                        {trend}
                    </span>
                    <span className="ml-2 text-gray-400">geçen aya göre</span>
                </div>
            )}
        </div>
    );
}
