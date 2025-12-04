import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Trash2, Plus, LayoutGrid, Edit2 } from 'lucide-react';

export function CustomSectionsEditor() {
    const {
        resumeData,
        addCustomSection,
        updateCustomSectionTitle,
        removeCustomSection,
        addCustomSectionItem,
        updateCustomSectionItem,
        removeCustomSectionItem
    } = useResumeStore();

    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [editingTitle, setEditingTitle] = useState(null);

    const handleAddSection = () => {
        if (newSectionTitle.trim()) {
            addCustomSection(newSectionTitle.trim());
            setNewSectionTitle('');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5" /> Custom Sections
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add new section */}
                <div className="flex gap-2">
                    <Input
                        value={newSectionTitle}
                        onChange={(e) => setNewSectionTitle(e.target.value)}
                        placeholder="Enter section title (e.g., Volunteer Work, Languages)"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
                    />
                    <Button onClick={handleAddSection} disabled={!newSectionTitle.trim()}>
                        <Plus className="mr-2 h-4 w-4" /> Add Section
                    </Button>
                </div>

                {/* Existing custom sections */}
                {resumeData.customSections.map((section) => (
                    <div key={section.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                            {editingTitle === section.id ? (
                                <Input
                                    value={section.title}
                                    onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
                                    onBlur={() => setEditingTitle(null)}
                                    onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(null)}
                                    className="max-w-xs"
                                    autoFocus
                                />
                            ) : (
                                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                    {section.title}
                                    <button onClick={() => setEditingTitle(section.id)} className="text-slate-400 hover:text-slate-600">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                </h4>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCustomSection(section.id)}
                                className="text-red-500 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Section items */}
                        <div className="space-y-2">
                            {section.items.map((item) => (
                                <div key={item.id} className="flex gap-2">
                                    <Input
                                        value={item.content}
                                        onChange={(e) => updateCustomSectionItem(section.id, item.id, e.target.value)}
                                        placeholder="Enter content..."
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeCustomSectionItem(section.id, item.id)}
                                        className="text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addCustomSectionItem(section.id, '')}
                                className="w-full mt-2"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Item
                            </Button>
                        </div>
                    </div>
                ))}

                {resumeData.customSections.length === 0 && (
                    <p className="text-center text-sm text-slate-500">
                        Create custom sections for unique resume content like Volunteer Work, Languages, Awards, etc.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
