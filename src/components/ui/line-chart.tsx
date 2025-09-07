"use client"

import * as React from "react"
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"

const LineChart = React.forwardRef<
    React.ElementRef<typeof RechartsLineChart>,
    Omit<React.ComponentPropsWithoutRef<typeof RechartsLineChart>, "children"> & {
        children: React.ReactNode
    }
>(({ children, ...props }, ref) => (
    <RechartsLineChart ref={ref} {...props}>
        {children}
    </RechartsLineChart>
))
LineChart.displayName = "LineChart"

const LineComponent = Line

const LineXAxis = XAxis
const LineYAxis = YAxis
const LineCartesianGrid = CartesianGrid

export { LineChart, LineComponent as Line, LineXAxis, LineYAxis, LineCartesianGrid }
