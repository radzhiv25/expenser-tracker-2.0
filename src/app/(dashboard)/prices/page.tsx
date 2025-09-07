import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function PricesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Prices</h1>
                <p className="text-muted-foreground">
                    Track and compare prices across different vendors
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Price Tracking
                    </CardTitle>
                    <CardDescription>
                        Monitor price changes and find the best deals
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                        <p className="text-muted-foreground">
                            Price tracking features will be available in a future update
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}



