#!/usr/bin/env node

/**
 * SEO Dead Link Finder
 * 
 * Scans the codebase for common SEO issues:
 * - href="#" placeholder links
 * - Missing alt text on images
 * - Broken internal links
 * - Missing section IDs for anchor links
 */

const fs = require('fs')
const path = require('path')

const issues = {
    deadLinks: [],
    missingAlt: [],
    anchorTargets: new Set(),
    anchorLinks: [],
}

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, index) => {
        const lineNum = index + 1

        // Check for href="#"
        if (line.match(/href=["']#["']/)) {
            issues.deadLinks.push({
                file: filePath,
                line: lineNum,
                content: line.trim(),
            })
        }

        // Check for missing alt text
        if (line.match(/<img[^>]*>/)) {
            if (!line.match(/alt=["'][^"']*["']/)) {
                issues.missingAlt.push({
                    file: filePath,
                    line: lineNum,
                    content: line.trim(),
                })
            }
        }

        // Collect anchor link targets
        const idMatch = line.match(/id=["']([^"']+)["']/)
        if (idMatch) {
            issues.anchorTargets.add(idMatch[1])
        }

        // Collect anchor links
        const hrefMatch = line.match(/href=["']#([^"']+)["']/)
        if (hrefMatch && hrefMatch[1] !== '') {
            issues.anchorLinks.push({
                file: filePath,
                line: lineNum,
                target: hrefMatch[1],
                content: line.trim(),
            })
        }
    })
}

function scanDirectory(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
            // Skip node_modules, .next, etc.
            if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(file)) {
                scanDirectory(filePath, extensions)
            }
        } else if (extensions.some((ext) => file.endsWith(ext))) {
            scanFile(filePath)
        }
    })
}

function generateReport() {
    console.log('🔍 SEO Dead Link Analysis Report\n')
    console.log('='.repeat(80))

    // Dead Links
    console.log('\n📍 Dead Links (href="#"): ' + issues.deadLinks.length)
    console.log('-'.repeat(80))
    if (issues.deadLinks.length > 0) {
        issues.deadLinks.forEach((issue) => {
            console.log(`\n  File: ${issue.file}`)
            console.log(`  Line: ${issue.line}`)
            console.log(`  Code: ${issue.content}`)
        })
    } else {
        console.log('  ✅ No dead links found!')
    }

    // Missing Alt Text
    console.log('\n\n🖼️  Missing Alt Text: ' + issues.missingAlt.length)
    console.log('-'.repeat(80))
    if (issues.missingAlt.length > 0) {
        issues.missingAlt.forEach((issue) => {
            console.log(`\n  File: ${issue.file}`)
            console.log(`  Line: ${issue.line}`)
            console.log(`  Code: ${issue.content}`)
        })
    } else {
        console.log('  ✅ All images have alt text!')
    }

    // Broken Anchor Links
    const brokenAnchors = issues.anchorLinks.filter(
        (link) => !issues.anchorTargets.has(link.target)
    )
    console.log('\n\n⚓ Broken Anchor Links: ' + brokenAnchors.length)
    console.log('-'.repeat(80))
    if (brokenAnchors.length > 0) {
        brokenAnchors.forEach((issue) => {
            console.log(`\n  File: ${issue.file}`)
            console.log(`  Line: ${issue.line}`)
            console.log(`  Target: #${issue.target}`)
            console.log(`  Code: ${issue.content}`)
        })
    } else {
        console.log('  ✅ All anchor links have targets!')
    }

    // Summary
    console.log('\n\n📊 Summary')
    console.log('='.repeat(80))
    console.log(`  Dead Links: ${issues.deadLinks.length}`)
    console.log(`  Missing Alt Text: ${issues.missingAlt.length}`)
    console.log(`  Broken Anchor Links: ${brokenAnchors.length}`)
    console.log(`  Total Issues: ${issues.deadLinks.length + issues.missingAlt.length + brokenAnchors.length}`)
    console.log('\n')
}

// Run the scan
const srcDir = path.join(__dirname, '../src')
console.log('Scanning directory:', srcDir)
console.log('')

scanDirectory(srcDir)
generateReport()

// Exit with error code if issues found
const totalIssues = issues.deadLinks.length + issues.missingAlt.length
if (totalIssues > 0) {
    process.exit(1)
}
