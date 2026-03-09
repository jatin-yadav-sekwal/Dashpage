import { useParams } from "react-router-dom";

export default function ProfilePage() {
    const { username } = useParams<{ username: string }>();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">@{username}</h1>
                <p className="text-muted-foreground">
                    Profile page — coming in Phase 3
                </p>
            </div>
        </div>
    );
}
