import { MoltbotChat } from './MoltbotChat'

export const metadata = {
    title: 'Moltbot Chat',
    description: 'Chat with your infrastructure assistant',
}

export default function MoltbotPage() {
    return (
        <div className="container mx-auto max-w-4xl py-8">
            <MoltbotChat />
        </div>
    )
}
