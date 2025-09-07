"use client"

import * as React from "react"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"

const BarChart = React.forwardRef<
    React.ElementRef<typeof RechartsBarChart>,
    Omit<React.ComponentPropsWithoutRef<typeof RechartsBarChart>, "children"> & {
        children: React.ReactNode
    }
>(({ children, ...props }, ref) => (
    <RechartsBarChart ref={ref} {...props}>
        {children}
    </RechartsBarChart>
))
BarChart.displayName = "BarChart"

const BarComponent = Bar

const BarXAxis = XAxis
const BarYAxis = YAxis
const BarCartesianGrid = CartesianGrid

export { BarChart, BarComponent as Bar, BarXAxis, BarYAxis, BarCartesianGrid }
