#!/bin/bash

# Script de Auditoria de Meta Tags SEO
# Verifica duplicação e ausência de meta tags Open Graph e Twitter Cards

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores globais
total_pages=0
pages_ok=0
pages_with_duplicates=0
pages_with_missing=0

# Arrays para armazenar resultados
declare -a pages_with_issues
declare -a pages_clean

# Função para auditar uma página
audit_page() {
    local file=$1
    local page=$2
    local has_issues=false
    local issues=""

    ((total_pages++))

    echo -e "\n${BLUE}=== Auditando: $page ===${NC}"

    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ ERRO: Arquivo não encontrado: $file${NC}"
        pages_with_issues+=("$page|ARQUIVO NÃO ENCONTRADO")
        ((pages_with_missing++))
        return
    fi

    # Verificar meta tags básicas
    local title_count=$(grep -o '<title>' "$file" | wc -l)
    local description_count=$(grep -o '<meta name="description"' "$file" | wc -l)
    local keywords_count=$(grep -o '<meta name="keywords"' "$file" | wc -l)
    local canonical_count=$(grep -o '<link rel="canonical"' "$file" | wc -l)

    # Verificar Open Graph
    local og_title=$(grep -o 'property="og:title"' "$file" | wc -l)
    local og_description=$(grep -o 'property="og:description"' "$file" | wc -l)
    local og_url=$(grep -o 'property="og:url"' "$file" | wc -l)
    local og_image=$(grep -o 'property="og:image"' "$file" | wc -l)
    local og_type=$(grep -o 'property="og:type"' "$file" | wc -l)
    local og_locale=$(grep -o 'property="og:locale"' "$file" | wc -l)
    local og_site_name=$(grep -o 'property="og:site_name"' "$file" | wc -l)

    # Verificar Twitter Cards
    local tw_card=$(grep -o 'name="twitter:card"' "$file" | wc -l)
    local tw_title=$(grep -o 'name="twitter:title"' "$file" | wc -l)
    local tw_description=$(grep -o 'name="twitter:description"' "$file" | wc -l)
    local tw_image=$(grep -o 'name="twitter:image"' "$file" | wc -l)
    local tw_site=$(grep -o 'name="twitter:site"' "$file" | wc -l)

    # Verificar duplicações
    echo -e "${YELLOW}Verificando duplicações...${NC}"

    if [ $title_count -gt 1 ]; then
        echo -e "${RED}  ❌ <title>: $title_count ocorrências${NC}"
        issues+="title:$title_count|"
        has_issues=true
    fi

    if [ $description_count -gt 1 ]; then
        echo -e "${RED}  ❌ meta description: $description_count ocorrências${NC}"
        issues+="description:$description_count|"
        has_issues=true
    fi

    if [ $canonical_count -gt 1 ]; then
        echo -e "${RED}  ❌ canonical: $canonical_count ocorrências${NC}"
        issues+="canonical:$canonical_count|"
        has_issues=true
    fi

    if [ $og_title -gt 1 ]; then
        echo -e "${RED}  ❌ og:title: $og_title ocorrências${NC}"
        issues+="og:title:$og_title|"
        has_issues=true
    fi

    if [ $og_description -gt 1 ]; then
        echo -e "${RED}  ❌ og:description: $og_description ocorrências${NC}"
        issues+="og:description:$og_description|"
        has_issues=true
    fi

    if [ $og_url -gt 1 ]; then
        echo -e "${RED}  ❌ og:url: $og_url ocorrências${NC}"
        issues+="og:url:$og_url|"
        has_issues=true
    fi

    if [ $og_image -gt 1 ]; then
        echo -e "${RED}  ❌ og:image: $og_image ocorrências${NC}"
        issues+="og:image:$og_image|"
        has_issues=true
    fi

    if [ $tw_title -gt 1 ]; then
        echo -e "${RED}  ❌ twitter:title: $tw_title ocorrências${NC}"
        issues+="twitter:title:$tw_title|"
        has_issues=true
    fi

    if [ $tw_description -gt 1 ]; then
        echo -e "${RED}  ❌ twitter:description: $tw_description ocorrências${NC}"
        issues+="twitter:description:$tw_description|"
        has_issues=true
    fi

    if [ $tw_image -gt 1 ]; then
        echo -e "${RED}  ❌ twitter:image: $tw_image ocorrências${NC}"
        issues+="twitter:image:$tw_image|"
        has_issues=true
    fi

    # Verificar tags faltando
    echo -e "${YELLOW}Verificando tags faltando...${NC}"

    if [ $title_count -eq 0 ]; then
        echo -e "${RED}  ❌ <title>: FALTANDO${NC}"
        issues+="missing:title|"
        has_issues=true
    fi

    if [ $description_count -eq 0 ]; then
        echo -e "${RED}  ❌ meta description: FALTANDO${NC}"
        issues+="missing:description|"
        has_issues=true
    fi

    if [ $canonical_count -eq 0 ]; then
        echo -e "${RED}  ❌ canonical: FALTANDO${NC}"
        issues+="missing:canonical|"
        has_issues=true
    fi

    if [ $og_title -eq 0 ]; then
        echo -e "${RED}  ❌ og:title: FALTANDO${NC}"
        issues+="missing:og:title|"
        has_issues=true
    fi

    if [ $og_description -eq 0 ]; then
        echo -e "${RED}  ❌ og:description: FALTANDO${NC}"
        issues+="missing:og:description|"
        has_issues=true
    fi

    if [ $og_url -eq 0 ]; then
        echo -e "${RED}  ❌ og:url: FALTANDO${NC}"
        issues+="missing:og:url|"
        has_issues=true
    fi

    if [ $og_image -eq 0 ]; then
        echo -e "${RED}  ❌ og:image: FALTANDO${NC}"
        issues+="missing:og:image|"
        has_issues=true
    fi

    if [ $tw_card -eq 0 ]; then
        echo -e "${RED}  ❌ twitter:card: FALTANDO${NC}"
        issues+="missing:twitter:card|"
        has_issues=true
    fi

    if [ $tw_title -eq 0 ]; then
        echo -e "${RED}  ❌ twitter:title: FALTANDO${NC}"
        issues+="missing:twitter:title|"
        has_issues=true
    fi

    if [ $tw_description -eq 0 ]; then
        echo -e "${RED}  ❌ twitter:description: FALTANDO${NC}"
        issues+="missing:twitter:description|"
        has_issues=true
    fi

    if [ $tw_image -eq 0 ]; then
        echo -e "${RED}  ❌ twitter:image: FALTANDO${NC}"
        issues+="missing:twitter:image|"
        has_issues=true
    fi

    # Resultado final da página
    if [ "$has_issues" = true ]; then
        echo -e "${RED}❌ PROBLEMA: Issues detectadas${NC}"
        pages_with_issues+=("$page|$issues")
        if [[ $issues == *"missing:"* ]]; then
            ((pages_with_missing++))
        fi
        if [[ $issues =~ :[2-9] ]]; then
            ((pages_with_duplicates++))
        fi
    else
        echo -e "${GREEN}✅ OK - Todas as tags estão corretas${NC}"
        pages_clean+=("$page")
        ((pages_ok++))
    fi
}

# Main
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Auditoria de Meta Tags SEO - Escola Habilidade     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ ERRO: Pasta dist/ não encontrada. Execute 'npm run build' primeiro.${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Iniciando auditoria...${NC}\n"

# Auditar páginas de cursos
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PÁGINAS DE CURSOS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

audit_page "dist/cursos/informatica.html" "/cursos/informatica"
audit_page "dist/cursos/projetista-3d.html" "/cursos/projetista-3d"
audit_page "dist/cursos/design-grafico.html" "/cursos/design-grafico"
audit_page "dist/cursos/programacao.html" "/cursos/programacao"
audit_page "dist/cursos/marketing-digital.html" "/cursos/marketing-digital"
audit_page "dist/cursos/inteligencia-artificial.html" "/cursos/inteligencia-artificial"
audit_page "dist/cursos/administracao.html" "/cursos/administracao"
audit_page "dist/cursos/excel-avancado-business-intelligence.html" "/cursos/excel-avancado-business-intelligence"
audit_page "dist/cursos/edicao-video.html" "/cursos/edicao-video"
audit_page "dist/cursos/sketchup-enscape.html" "/cursos/sketchup-enscape"

# Auditar páginas locais
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PÁGINAS LOCAIS (SEO LOCAL)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

audit_page "dist/cursos-florianopolis.html" "/cursos-florianopolis"
audit_page "dist/cursos-sao-jose.html" "/cursos-sao-jose"
audit_page "dist/cursos-palhoca.html" "/cursos-palhoca"

# Auditar páginas institucionais
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PÁGINAS INSTITUCIONAIS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

audit_page "dist/index.html" "/ (home)"
audit_page "dist/contato.html" "/contato"
audit_page "dist/blog.html" "/blog"
audit_page "dist/teste-vocacional.html" "/teste-vocacional"

# Relatório final
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              RESUMO EXECUTIVO                          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"

echo -e "\nTotal de páginas auditadas: ${BLUE}$total_pages${NC}"
echo -e "Páginas sem problemas: ${GREEN}$pages_ok${NC}"
echo -e "Páginas com duplicação: ${RED}$pages_with_duplicates${NC}"
echo -e "Páginas com tags faltando: ${YELLOW}$pages_with_missing${NC}"

if [ $pages_ok -eq $total_pages ]; then
    echo -e "\n${GREEN}✅ PERFEITO! Todas as páginas estão com meta tags corretas!${NC}"
else
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}PÁGINAS COM PROBLEMAS${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    for item in "${pages_with_issues[@]}"; do
        IFS='|' read -ra PARTS <<< "$item"
        page="${PARTS[0]}"
        echo -e "\n${RED}❌ $page${NC}"

        # Processar issues
        for ((i=1; i<${#PARTS[@]}; i++)); do
            issue="${PARTS[$i]}"
            if [ -n "$issue" ]; then
                echo -e "   - $issue"
            fi
        done
    done

    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}PÁGINAS OK ✅${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    for page in "${pages_clean[@]}"; do
        echo -e "${GREEN}✅ $page${NC}"
    done
fi

echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              RECOMENDAÇÕES                             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"

if [ $pages_with_duplicates -gt 0 ]; then
    echo -e "\n${YELLOW}1. Para corrigir duplicações:${NC}"
    echo -e "   - Verificar se há tags no index.html que devem ser removidas"
    echo -e "   - Verificar se há conflito entre Helmet/SEOHead e transform-html-meta.js"
    echo -e "   - Aplicar fix similar ao da página de informática"
fi

if [ $pages_with_missing -gt 0 ]; then
    echo -e "\n${YELLOW}2. Para adicionar tags faltando:${NC}"
    echo -e "   - Adicionar no transform-html-meta.js no metaConfig"
    echo -e "   - Ou adicionar no componente específico via Helmet/SEOHead"
fi

echo -e "\n${YELLOW}3. Validação final recomendada:${NC}"
echo -e "   - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/"
echo -e "   - Twitter Card Validator: https://cards-dev.twitter.com/validator"
echo -e "   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/"

echo -e "\n${GREEN}Auditoria concluída!${NC}\n"
