import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export function PersonalSection() {
    const { resumeData, updatePersonalInfo } = useResumeStore();
    const { personalInfo } = resumeData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        updatePersonalInfo({ [name]: value });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        value={personalInfo.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={personalInfo.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        name="location"
                        value={personalInfo.location}
                        onChange={handleChange}
                        placeholder="New York, NY"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                        id="linkedin"
                        name="linkedin"
                        value={personalInfo.linkedin}
                        onChange={handleChange}
                        placeholder="linkedin.com/in/johndoe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                        id="github"
                        name="github"
                        value={personalInfo.github || ''}
                        onChange={handleChange}
                        placeholder="github.com/johndoe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input
                        id="portfolio"
                        name="portfolio"
                        value={personalInfo.portfolio}
                        onChange={handleChange}
                        placeholder="johndoe.com"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
