export async function copyToClipboard(text: string): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch (err) {
            console.warn('Navigator clipboard failed, trying fallback', err)
        }
    }

    // Fallback for non-secure contexts (http)
    try {
        const textArea = document.createElement("textarea")
        textArea.value = text

        // Ensure it's not visible but part of DOM to allow selection
        textArea.style.position = "fixed"
        textArea.style.left = "-9999px"
        textArea.style.top = "0"
        document.body.appendChild(textArea)

        textArea.focus()
        textArea.select()

        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
    } catch (err) {
        console.error('Fallback clipboard failed', err)
        return false
    }
}
