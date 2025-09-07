/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

// Chart container
const ChartContainer = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        config: Record<string, unknown>
    }
>(({ id, className, children, config, ...props }, ref) => {
    return (
        <div
            data-chart={id}
            ref={ref}
            className={cn("flex justify-center w-full h-full", className)}
            {...props}
        >
            <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
                {children as React.ReactElement}
            </RechartsPrimitive.ResponsiveContainer>
        </div>
    )
})
ChartContainer.displayName = "Chart"

// Chart tooltip
const ChartTooltip = RechartsPrimitive.Tooltip

// Chart legend
const ChartLegend = RechartsPrimitive.Legend

// Chart tooltip content
const ChartTooltipContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
        hideLabel?: boolean
        hideIndicator?: boolean
        indicator?: "line" | "dot" | "dashed"
        nameKey?: string
        labelKey?: string
        payload?: unknown[]
        label?: string
        labelFormatter?: (value: unknown, name: unknown) => React.ReactNode
        labelClassName?: string
        formatter?: (value: unknown, name: unknown, item: unknown) => React.ReactNode
        color?: string
    }
>(
    (
        {
            active,
            payload,
            className,
            indicator = "dot",
            hideLabel = false,
            hideIndicator = false,
            label,
            labelFormatter,
            labelClassName,
            formatter,
            color,
            nameKey,
            labelKey,
        },
        ref
    ) => {
        const tooltipLabel = React.useMemo(() => {
            if (hideLabel || !payload?.length) {
                return null
            }

            const [item] = payload
            const key = `${labelKey || (item as { dataKey?: string; name?: string })?.dataKey || (item as { dataKey?: string; name?: string })?.name || "value"}`
            const value =
                typeof label === "string"
                    ? label
                    : typeof labelFormatter === "function"
                        ? labelFormatter(label, payload)
                        : label

            return (
                <div className={cn("font-medium", labelClassName)}>
                    {value}
                </div>
            )
        }, [
            label,
            labelFormatter,
            payload,
            hideLabel,
            labelClassName,
            labelKey,
        ])

        if (!active || !payload?.length) {
            return null
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
                    className
                )}
            >
                {tooltipLabel}
                <div className="grid gap-1.5">
                    {payload.map((item, index) => {
                        const key = `${nameKey || (item as { name?: string; dataKey?: string })?.name || (item as { name?: string; dataKey?: string })?.dataKey || "value"}`
                        const indicatorColor = color || (item as { payload?: { fill?: string }; color?: string })?.payload?.fill || (item as { payload?: { fill?: string }; color?: string })?.color

                        return (
                            <div
                                key={(item as { dataKey?: string })?.dataKey}
                                className={cn(
                                    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                                    indicator === "dot" && "items-center"
                                )}
                            >
                                {formatter && typeof formatter === "function" ? (
                                    formatter((item as any).value, (item as any).name, item as any, index, (item as any).payload)
                                ) : (
                                    <>
                                        {!hideIndicator && (
                                            <div
                                                className={cn(
                                                    "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                                                    {
                                                        "h-2.5 w-2.5": indicator === "dot",
                                                        "w-1": indicator === "line",
                                                        "w-0 border-[1.5px] border-dashed bg-transparent":
                                                            indicator === "dashed",
                                                    }
                                                )}
                                                style={
                                                    {
                                                        "--color-bg": indicatorColor,
                                                        "--color-border": indicatorColor,
                                                    } as React.CSSProperties
                                                }
                                            />
                                        )}
                                        <div
                                            className={cn(
                                                "flex flex-1 justify-between leading-none",
                                                hideIndicator && "items-center"
                                            )}
                                        >
                                            <div className="grid gap-1.5">
                                                <div className="text-[--color-text]">
                                                    {key}
                                                </div>
                                            </div>
                                            {(item as any).value && (
                                                <div className="font-mono font-medium tabular-nums text-[--color-text]">
                                                    {(item as any).value}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
}
