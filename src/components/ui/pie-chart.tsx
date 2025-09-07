"use client"

import * as React from "react"
import { PieChart as RechartsPieChart, Cell, Pie } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"

const PieChart = React.forwardRef<
    React.ElementRef<typeof RechartsPieChart>,
    Omit<React.ComponentPropsWithoutRef<typeof RechartsPieChart>, "children"> & {
        children: React.ReactNode
    }
>(({ children, ...props }, ref) => (
    <RechartsPieChart ref={ref} {...props}>
        {children}
    </RechartsPieChart>
))
PieChart.displayName = "PieChart"

const PieCell = Cell

export { PieChart, Pie, PieCell }
