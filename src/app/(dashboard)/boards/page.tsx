"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Kanban, Calendar, Trash2 } from "lucide-react";
import { AuthService } from "@/lib/auth";
import { KanbanService } from "@/lib/kanban-service";
import { KanbanBoard } from "@/lib/kanban-types";
import { KanbanBoardComponent } from "@/components/kanban-board";
import { databases } from "@/lib/appwrite";
import { KANBAN_COLLECTIONS } from "@/lib/kanban-types";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'main';

export default function BoardsPage() {
    const [boards, setBoards] = useState<KanbanBoard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<{ $id: string; name: string; email: string } | null>(null);
    const [selectedBoard, setSelectedBoard] = useState<KanbanBoard | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState<KanbanBoard | null>(null);
    const [newBoardName, setNewBoardName] = useState("");
    const [isCreatingBoard, setIsCreatingBoard] = useState(false);
    const [isDeletingBoard, setIsDeletingBoard] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuthAndLoadBoards = async () => {
            try {
                const currentUser = await AuthService.getCurrentUser();
                if (!currentUser) {
                    router.push('/login');
                    return;
                }

                setUser(currentUser);

                // Load boards
                const userBoards = await KanbanService.getBoards(currentUser.$id);
                setBoards(userBoards);

                // If no boards exist, create a default one
                if (userBoards.length === 0) {
                    const defaultBoard = await KanbanService.initializeDefaultBoard(currentUser.$id);
                    setBoards([defaultBoard]);
                    setSelectedBoard(defaultBoard);
                } else {
                    setSelectedBoard(userBoards[0]);
                }
            } catch (err) {
                console.error('Error loading boards:', err);
                setError('Failed to load boards');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndLoadBoards();
    }, [router]);

    const handleCreateBoard = async () => {
        if (!user || !newBoardName.trim()) return;

        try {
            setIsCreatingBoard(true);
            setError(null);
            const newBoard = await KanbanService.createBoard(
                { name: newBoardName },
                user.$id
            );

            // Create default columns for the new board
            for (const columnData of [
                { name: 'To Log', order: 0 },
                { name: 'Verify', order: 1 },
                { name: 'Paid', order: 2 },
                { name: 'Reimburse', order: 3 }
            ]) {
                await KanbanService.createColumn({
                    boardId: newBoard.$id,
                    name: columnData.name,
                    order: columnData.order
                }, user.$id);
            }

            setBoards([newBoard, ...boards]);
            setSelectedBoard(newBoard);
            setNewBoardName("");
            setIsCreateDialogOpen(false);
        } catch (err) {
            console.error('Failed to create board:', err);
            setError('Failed to create board');
        } finally {
            setIsCreatingBoard(false);
        }
    };

    const handleDeleteBoard = async () => {
        if (!user || !boardToDelete) return;

        try {
            setIsDeletingBoard(true);
            setError(null);
            // Delete all columns and cards for this board first
            const columns = await KanbanService.getColumns(boardToDelete.$id, user.$id);

            for (const column of columns) {
                const cards = await KanbanService.getCards(boardToDelete.$id, user.$id);
                for (const card of cards) {
                    await KanbanService.deleteCard(card.$id, user.$id);
                }
                // Delete the column
                await databases.deleteDocument(DB_ID, KANBAN_COLLECTIONS.COLUMNS, column.$id);
            }

            // Delete the board itself
            await KanbanService.deleteBoard(boardToDelete.$id, user.$id);

            // Update local state
            const updatedBoards = boards.filter(board => board.$id !== boardToDelete.$id);
            setBoards(updatedBoards);

            // Select another board if available
            if (updatedBoards.length > 0) {
                setSelectedBoard(updatedBoards[0]);
            } else {
                setSelectedBoard(null);
            }

            setIsDeleteDialogOpen(false);
            setBoardToDelete(null);
        } catch (err) {
            console.error('Failed to delete board:', err);
            setError('Failed to delete board');
        } finally {
            setIsDeletingBoard(false);
        }
    };

    const openDeleteDialog = (board: KanbanBoard) => {
        setBoardToDelete(board);
        setIsDeleteDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading boards...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Kanban Boards</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Manage your expense workflow with visual boards
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            New Board
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Board</DialogTitle>
                            <DialogDescription>
                                Create a new Kanban board for your expenses
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="board-name">Board Name</Label>
                                <Input
                                    id="board-name"
                                    value={newBoardName}
                                    onChange={(e) => setNewBoardName(e.target.value)}
                                    placeholder="Enter board name"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateBoard} disabled={!newBoardName.trim() || isCreatingBoard}>
                                    {isCreatingBoard ? (
                                        <>
                                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Board'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Board Selection */}
            {boards.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Select a Board</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {boards.map((board) => (
                            <Card
                                key={board.$id}
                                className={`group cursor-pointer transition-all hover:shadow-md relative ${selectedBoard?.$id === board.$id
                                    ? 'ring-2 ring-primary'
                                    : ''
                                    }`}
                                onClick={() => setSelectedBoard(board)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Kanban className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                                            <CardTitle className="text-sm sm:text-base truncate">{board.name}</CardTitle>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 sm:h-8 sm:w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteDialog(board);
                                            }}
                                        >
                                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                        <span className="truncate">Created {new Date(board.$createdAt).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Kanban Board */}
            {selectedBoard && user && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h2 className="text-lg sm:text-xl font-semibold truncate">{selectedBoard.name}</h2>
                        <Badge variant="outline" className="w-fit">
                            {boards.length} board{boards.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>

                    <div className="h-[calc(100vh-400px)] sm:h-[calc(100vh-300px)] min-h-[300px] sm:min-h-[400px] overflow-hidden">
                        <KanbanBoardComponent
                            boardId={selectedBoard.$id}
                            userId={user.$id}
                        />
                    </div>
                </div>
            )}

            {/* Delete Board Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Board</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{boardToDelete?.name}&quot;? This action cannot be undone and will delete all cards and columns in this board.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteBoard}
                            disabled={!boardToDelete || isDeletingBoard}
                        >
                            {isDeletingBoard ? (
                                <>
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Board
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Empty State */}
            {boards.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Kanban className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No boards yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Create your first Kanban board to start organizing your expenses
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Board
                    </Button>
                </div>
            )}
        </div>
    );
}
