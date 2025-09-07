"use client"

import * as React from "react"
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"

const AreaChart = React.forwardRef<
    React.ElementRef<typeof RechartsAreaChart>,
    Omit<React.ComponentPropsWithoutRef<typeof RechartsAreaChart>, "children"> & {
        children: React.ReactNode
    }
>(({ children, ...props }, ref) => (
    <RechartsAreaChart ref={ref} {...props}>
        {children}
    </RechartsAreaChart>
))
AreaChart.displayName = "AreaChart"

const AreaComponent = Area

const AreaXAxis = XAxis
const AreaYAxis = YAxis
const AreaCartesianGrid = CartesianGrid

export { AreaChart, AreaComponent as Area, AreaXAxis, AreaYAxis, AreaCartesianGrid }
