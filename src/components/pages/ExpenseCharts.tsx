"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, PieCell } from "@/components/ui/pie-chart";
import { BarChart, Bar, BarXAxis, BarYAxis, BarCartesianGrid } from "@/components/ui/bar-chart";
import { LineChart, Line, LineXAxis, LineYAxis, LineCartesianGrid } from "@/components/ui/line-chart";
import { AreaChart, Area, AreaXAxis, AreaYAxis, AreaCartesianGrid } from "@/components/ui/area-chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon } from "lucide-react";
import { Expense } from "@/lib/expense-service";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";

interface ExpenseChartsProps {
    expenses: Expense[];
}

const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
    "#82CA9D", "#FFC658", "#FF7C7C", "#8DD1E1", "#D084D0"
];

export function ExpenseCharts({ expenses }: ExpenseChartsProps) {
    const [chartType, setChartType] = useState<"pie" | "bar" | "line" | "area">("pie");
    const [dataType, setDataType] = useState<"category" | "currency">("category");

    // Process data for category spending
    const categoryData = expenses.reduce((acc, expense) => {
        const existing = acc.find(item => item.category === expense.category);
        if (existing) {
            existing.amount += expense.amount;
            existing.count += 1;
        } else {
            acc.push({
                category: expense.category,
                amount: expense.amount,
                count: 1,
                currency: expense.currency
            });
        }
        return acc;
    }, [] as Array<{ category: string; amount: number; count: number; currency: string }>);

    // Process data for currency spending
    const currencyData = expenses.reduce((acc, expense) => {
        const existing = acc.find(item => item.currency === expense.currency);
        if (existing) {
            existing.amount += expense.amount;
            existing.count += 1;
        } else {
            acc.push({
                currency: expense.currency,
                amount: expense.amount,
                count: 1,
                symbol: getCurrencySymbol(expense.currency)
            });
        }
        return acc;
    }, [] as Array<{ currency: string; amount: number; count: number; symbol: string }>);

    // Sort data by amount (descending)
    const sortedCategoryData = categoryData.sort((a, b) => b.amount - a.amount);
    const sortedCurrencyData = currencyData.sort((a, b) => b.amount - a.amount);

    // Prepare chart data
    const chartData = dataType === "category" ? sortedCategoryData : sortedCurrencyData;
    const chartDataForRecharts = chartData.map((item, index) => ({
        name: dataType === "category" ? (item as { category: string }).category : (item as { currency: string }).currency,
        value: item.amount,
        count: item.count,
        color: COLORS[index % COLORS.length],
        ...(dataType === "currency" && { symbol: (item as { symbol: string }).symbol })
    }));

    const renderChart = () => {
        const commonProps = {
            data: chartDataForRecharts,
            margin: { top: 20, right: 30, left: 20, bottom: 60 },
        };

        switch (chartType) {
            case "pie":
                return (
                    <ChartContainer config={{}}>
                        <PieChart {...commonProps}>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Pie
                                data={chartDataForRecharts}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartDataForRecharts.map((entry, index) => (
                                    <PieCell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                );

            case "bar":
                return (
                    <ChartContainer config={{}}>
                        <BarChart {...commonProps}>
                            <BarCartesianGrid strokeDasharray="3 3" />
                            <BarXAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <BarYAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => formatCurrency(value, dataType === "currency" ? chartData[0]?.currency || "USD" : "USD").replace(/[^\d.,]/g, '')}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ChartContainer>
                );

            case "line":
                return (
                    <ChartContainer config={{}}>
                        <LineChart {...commonProps}>
                            <LineCartesianGrid strokeDasharray="3 3" />
                            <LineXAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <LineYAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => formatCurrency(value, dataType === "currency" ? chartData[0]?.currency || "USD" : "USD").replace(/[^\d.,]/g, '')}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ChartContainer>
                );

            case "area":
                return (
                    <ChartContainer config={{}}>
                        <AreaChart {...commonProps}>
                            <AreaCartesianGrid strokeDasharray="3 3" />
                            <AreaXAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <AreaYAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => formatCurrency(value, dataType === "currency" ? chartData[0]?.currency || "USD" : "USD").replace(/[^\d.,]/g, '')}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        </AreaChart>
                    </ChartContainer>
                );

            default:
                return null;
        }
    };

    const getTotalAmount = () => {
        return chartData.reduce((sum, item) => sum + item.amount, 0);
    };

    const getTotalCount = () => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <TrendingUp className="h-6 w-6" />
                        Expense Analytics
                    </CardTitle>
                    <CardDescription className="text-base">
                        Visualize your spending patterns by category and currency
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Controls */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-6">
                        {/* Data Type Toggle */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground">Data View</h3>
                            <Tabs value={dataType} onValueChange={(value) => setDataType(value as "category" | "currency")}>
                                <TabsList className="grid w-full max-w-md grid-cols-2">
                                    <TabsTrigger value="category">By Category</TabsTrigger>
                                    <TabsTrigger value="currency">By Currency</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Chart Type Toggle */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground">Chart Type</h3>
                            <Tabs value={chartType} onValueChange={(value) => setChartType(value as "pie" | "bar" | "line" | "area")}>
                                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                                    <TabsTrigger value="pie" className="flex items-center gap-2">
                                        <PieChartIcon className="h-4 w-4" />
                                        <span className="hidden sm:inline">Pie</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="bar" className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4" />
                                        <span className="hidden sm:inline">Bar</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="line" className="flex items-center gap-2">
                                        <LineChartIcon className="h-4 w-4" />
                                        <span className="hidden sm:inline">Line</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="area" className="flex items-center gap-2">
                                        <AreaChartIcon className="h-4 w-4" />
                                        <span className="hidden sm:inline">Area</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <DollarSign className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                <p className="text-2xl font-bold">{formatCurrency(getTotalAmount(), dataType === "currency" ? chartData[0]?.currency || "USD" : "USD")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total {dataType === "category" ? "Categories" : "Currencies"}</p>
                                <p className="text-2xl font-bold">{chartData.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <PieChartIcon className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                                <p className="text-2xl font-bold">{getTotalCount()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card>
                <CardContent className="p-6">
                    <div className="h-[500px] w-full min-h-[500px]">
                        {renderChart()}
                    </div>
                </CardContent>
            </Card>

            {/* Legend */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        {dataType === "category" ? "Categories" : "Currencies"} Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {chartDataForRecharts.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <div>
                                        <span className="text-sm font-medium">{item.name}</span>
                                        {dataType === "currency" && (
                                            <Badge variant="secondary" className="ml-2 text-xs">
                                                {(item as { symbol: string }).symbol}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">
                                        {formatCurrency(item.value, dataType === "currency" ? item.name : "USD")}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.count} transaction{item.count !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
