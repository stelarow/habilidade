#!/bin/bash

# Read JSON input from stdin
input=$(cat)

# Extract basic information
model=$(echo "$input" | jq -r '.model.display_name // "Claude"')
cwd=$(echo "$input" | jq -r '.workspace.current_dir // "$(pwd)"' | sed 's|.*/||')
style=$(echo "$input" | jq -r '.output_style.name // "default"')
time=$(date '+%H:%M')

# Get git information
if git rev-parse --git-dir > /dev/null 2>&1; then
    branch=$(git branch --show-current 2>/dev/null || echo "detached")
    git_info=" git:$branch"
else
    git_info=""
fi

# Extract token usage information
session_id=$(echo "$input" | jq -r '.session_id // ""')
transcript_path=$(echo "$input" | jq -r '.transcript_path // ""')

# Initialize token counters
input_tokens=0
output_tokens=0
total_tokens=0

# Try to extract token usage from transcript if available
if [[ -n "$transcript_path" && -f "$transcript_path" ]]; then
    # Count approximate tokens from transcript
    # This is a simplified approach - counting words and estimating tokens
    if command -v wc >/dev/null 2>&1; then
        word_count=$(wc -w < "$transcript_path" 2>/dev/null || echo "0")
        # Rough estimate: 1 token ≈ 0.75 words for English text
        total_tokens=$((word_count * 4 / 3))
        # Split roughly 60/40 between input/output for estimation
        input_tokens=$((total_tokens * 6 / 10))
        output_tokens=$((total_tokens - input_tokens))
    fi
fi

# Format token information concisely
if [[ $total_tokens -gt 0 ]]; then
    # Format with K for thousands for readability
    if [[ $total_tokens -gt 1000 ]]; then
        total_display="${total_tokens: -3}K"
        if [[ ${#total_tokens} -gt 4 ]]; then
            total_display="$((total_tokens / 1000))K"
        fi
        tokens_info=" 🪙${total_display}"
    else
        tokens_info=" 🪙${total_tokens}"
    fi
else
    tokens_info=" 🪙-"
fi

# Build and print the status line with dimmed colors
printf "\033[2m%s@%s \033[0m\033[36m%s\033[0m\033[2m%s [%s] [%s]%s %s\033[0m" \
    "$(whoami)" \
    "$(hostname -s)" \
    "$cwd" \
    "$git_info" \
    "$model" \
    "$style" \
    "$tokens_info" \
    "$time"