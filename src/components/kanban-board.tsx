"use client";

import { useState, useEffect, useCallback } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCenter, useDroppable, PointerSensor, useSensor, useSensors, TouchSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Calendar as CalendarIcon, Edit, Trash2, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { KanbanService } from "@/lib/kanban-service";
import { KanbanColumn, KanbanCard, CreateCardData, UpdateCardData } from "@/lib/kanban-types";

interface KanbanBoardProps {
    boardId: string;
    userId: string;
}

interface ColumnWithCards extends KanbanColumn {
    cards: KanbanCard[];
}

interface KanbanCardProps {
    card: KanbanCard;
    onEdit: (card: KanbanCard) => void;
    onDelete: (cardId: string) => void;
}

function KanbanCardComponent({ card, onEdit, onDelete }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.$id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative transition-all duration-200",
                isDragging && "opacity-50 z-50 scale-105 shadow-lg"
            )}
        >
            <Card className="hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                            <div
                                className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors duration-150 opacity-0 group-hover:opacity-100 flex-shrink-0"
                                {...attributes}
                                {...listeners}
                            >
                                <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-xs sm:text-sm font-medium line-clamp-2 flex-1 truncate">
                                {card.title}
                            </CardTitle>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(card);
                                }}
                            >
                                <Edit className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(card.$id);
                                }}
                            >
                                <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    {card.description && (
                        <CardDescription className="text-xs line-clamp-2 mb-2">
                            {card.description}
                        </CardDescription>
                    )}

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1 min-w-0">
                            {card.labels?.map((label, index) => (
                                <Badge key={index} variant="secondary" className="text-xs truncate">
                                    {label}
                                </Badge>
                            ))}
                        </div>

                        {card.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                                <CalendarIcon className="h-3 w-3" />
                                <span className="hidden sm:inline">{format(new Date(card.dueDate), "MMM d")}</span>
                                <span className="sm:hidden">{format(new Date(card.dueDate), "M/d")}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface KanbanColumnProps {
    column: ColumnWithCards;
    onAddCard: (columnId: string) => void;
    onEditCard: (card: KanbanCard) => void;
    onDeleteCard: (cardId: string) => void;
    isDragOver?: boolean;
}

function KanbanColumnComponent({ column, onAddCard, onEditCard, onDeleteCard, isDragOver }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.$id,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col w-72 sm:w-80 bg-muted/30 rounded-lg p-3 sm:p-4 transition-all duration-200 min-h-[200px] flex-shrink-0",
                (isOver || isDragOver) && "bg-primary/10 border-2 border-dashed border-primary"
            )}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">{column.name}</h3>
                <Badge variant="secondary" className="text-xs">
                    {column.cards.length}
                </Badge>
            </div>

            <div className="flex-1 min-h-0">
                <SortableContext items={column.cards.map(card => card.$id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {column.cards.map((card) => (
                            <KanbanCardComponent
                                key={card.$id}
                                card={card}
                                onEdit={onEditCard}
                                onDelete={onDeleteCard}
                            />
                        ))}
                    </div>
                </SortableContext>
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="mt-4 w-full justify-start text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                onClick={() => onAddCard(column.$id)}
            >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="hidden sm:inline">Add a card</span>
                <span className="sm:hidden">Add</span>
            </Button>
        </div>
    );
}

export function KanbanBoardComponent({ boardId, userId }: KanbanBoardProps) {
    // Hooks must be called in the same order every time
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const [columns, setColumns] = useState<ColumnWithCards[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isCreatingCard, setIsCreatingCard] = useState(false);
    const [isUpdatingCard, setIsUpdatingCard] = useState(false);
    const [isDeletingCard, setIsDeletingCard] = useState(false);
    const [formData, setFormData] = useState<CreateCardData>({
        boardId,
        columnId: "",
        title: "",
        description: "",
        labels: [],
        order: 0,
        dueDate: "",
    });

    const loadBoard = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await KanbanService.getBoardWithData(boardId, userId);
            setColumns(data.columns);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load board");
        } finally {
            setIsLoading(false);
        }
    }, [boardId, userId]);

    useEffect(() => {
        loadBoard();
    }, [boardId, userId, loadBoard]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;
        if (over) {
            console.log("Drag over:", over.id);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the card being dragged
        let draggedCard: KanbanCard | null = null;
        let sourceColumnId = "";

        for (const column of columns) {
            const card = column.cards.find(c => c.$id === activeId);
            if (card) {
                draggedCard = card;
                sourceColumnId = column.$id;
                break;
            }
        }

        if (!draggedCard) return;

        // Find the target column
        let targetColumnId = "";
        let targetOrder = 0;

        // Check if dropped on a column
        const targetColumn = columns.find(c => c.$id === overId);
        if (targetColumn) {
            targetColumnId = targetColumn.$id;
            targetOrder = targetColumn.cards.length;
        } else {
            // Check if dropped on a card
            for (const column of columns) {
                const card = column.cards.find(c => c.$id === overId);
                if (card) {
                    targetColumnId = column.$id;
                    targetOrder = card.order;
                    break;
                }
            }
        }

        if (!targetColumnId || sourceColumnId === targetColumnId) return;

        // Optimistic update - immediately update the UI
        setColumns(prevColumns => {
            const newColumns = [...prevColumns];

            // Find source and target columns
            const sourceColumnIndex = newColumns.findIndex(col => col.$id === sourceColumnId);
            const targetColumnIndex = newColumns.findIndex(col => col.$id === targetColumnId);

            if (sourceColumnIndex === -1 || targetColumnIndex === -1) return prevColumns;

            // Remove card from source column
            const sourceColumn = { ...newColumns[sourceColumnIndex] };
            const cardIndex = sourceColumn.cards.findIndex(card => card.$id === activeId);
            if (cardIndex === -1) return prevColumns;

            const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);

            // Add card to target column
            const targetColumn = { ...newColumns[targetColumnIndex] };
            const updatedCard = { ...movedCard, columnId: targetColumnId, order: targetOrder };
            targetColumn.cards.push(updatedCard);

            // Update the columns
            newColumns[sourceColumnIndex] = sourceColumn;
            newColumns[targetColumnIndex] = targetColumn;

            return newColumns;
        });

        // Update the database in the background
        try {
            await KanbanService.moveCard({
                cardId: activeId,
                newColumnId: targetColumnId,
                newOrder: targetOrder,
            }, userId);
        } catch (err) {
            console.error("Failed to move card:", err);
            // Revert the optimistic update on error
            await loadBoard();
            setError("Failed to move card");
        }
    };

    const handleAddCard = (columnId: string) => {
        console.log("Adding card to column:", columnId);
        setFormData({
            boardId,
            columnId,
            title: "",
            description: "",
            labels: [],
            order: columns.find(c => c.$id === columnId)?.cards.length || 0,
            dueDate: "",
        });
        setIsCreateDialogOpen(true);
    };

    const handleEditCard = (card: KanbanCard) => {
        setEditingCard(card);
        setFormData({
            boardId: card.boardId,
            columnId: card.columnId,
            title: card.title,
            description: card.description || "",
            labels: card.labels || [],
            order: card.order,
            dueDate: card.dueDate || "",
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteCard = async (cardId: string) => {
        if (!confirm("Are you sure you want to delete this card?")) return;

        try {
            setIsDeletingCard(true);
            setError(null);
            await KanbanService.deleteCard(cardId, userId);
            await loadBoard();
        } catch (err) {
            console.error("Failed to delete card:", err);
            setError("Failed to delete card");
        } finally {
            setIsDeletingCard(false);
        }
    };

    const handleCreateCard = async () => {
        if (!formData.title.trim()) {
            setError("Card title is required");
            return;
        }

        try {
            setIsCreatingCard(true);
            setError(null);
            await KanbanService.createCard(formData, userId);
            setIsCreateDialogOpen(false);
            await loadBoard();
        } catch (err) {
            console.error("Failed to create card:", err);
            setError(err instanceof Error ? err.message : "Failed to create card");
        } finally {
            setIsCreatingCard(false);
        }
    };

    const handleUpdateCard = async () => {
        if (!editingCard) return;

        try {
            setIsUpdatingCard(true);
            setError(null);
            const updateData: UpdateCardData = {
                title: formData.title,
                description: formData.description,
                labels: formData.labels,
                dueDate: formData.dueDate,
            };

            await KanbanService.updateCard(editingCard.$id, updateData, userId);
            setIsEditDialogOpen(false);
            setEditingCard(null);
            await loadBoard();
        } catch (err) {
            console.error("Failed to update card:", err);
            setError("Failed to update card");
        } finally {
            setIsUpdatingCard(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading board...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={loadBoard}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {columns.map((column) => (
                        <div key={column.$id} id={column.$id} className="flex-shrink-0">
                            <KanbanColumnComponent
                                column={column}
                                onAddCard={handleAddCard}
                                onEditCard={handleEditCard}
                                onDeleteCard={handleDeleteCard}
                                isDragOver={activeId !== null}
                            />
                        </div>
                    ))}
                </div>
            </DndContext>

            {/* Create Card Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Card</DialogTitle>
                        <DialogDescription>
                            Add a new card to the board
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                                {error}
                            </div>
                        )}
                        <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Card title"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Card description"
                            />
                        </div>
                        <div>
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.dueDate ? format(new Date(formData.dueDate), "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                setFormData({ ...formData, dueDate: date.toISOString().split('T')[0] });
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateCard} disabled={!formData.title || isCreatingCard}>
                                {isCreatingCard ? (
                                    <>
                                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Card Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Card</DialogTitle>
                        <DialogDescription>
                            Update the card details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Card title"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Card description"
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-dueDate">Due Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.dueDate ? format(new Date(formData.dueDate), "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                setFormData({ ...formData, dueDate: date.toISOString().split('T')[0] });
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateCard} disabled={!formData.title || isUpdatingCard}>
                                {isUpdatingCard ? (
                                    <>
                                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}



