# 6. Design e Integração de API

Para suportar o salvamento das novas informações de agendamento, são necessárias modificações na API de matrícula existente.

## 6.1. Estratégia de Integração de API
*   **Estratégia de Integração de API:** Modificar o endpoint existente de criação/atualização de matrículas para aceitar um campo opcional `schedules`. Se o campo estiver presente, a API irá criar ou atualizar os registros de agendamento associados na nova tabela `student_schedules`.
*   **Autenticação:** A autenticação existente, baseada em políticas de segurança de nível de linha (RLS) do Supabase para administradores, será aplicada a este endpoint. Nenhuma alteração na autenticação é necessária.
*   **Versionamento:** Não será criada uma nova versão da API. Os novos campos (`modality`, `schedules`) serão opcionais no payload para garantir a compatibilidade com as chamadas existentes que não incluem agendamento.

## 6.2. Endpoints de API Modificados

### **`POST /api/enrollments` e `PUT /api/enrollments/{id}`**
*   **Método:** `POST` (Criar), `PUT` (Atualizar)
*   **Endpoint:** `/api/enrollments` e `/api/enrollments/{id}` (assumindo um endpoint existente)
*   **Propósito:** Criar ou atualizar uma matrícula de aluno. A lógica será estendida para lidar com a criação/atualização de agendamentos de aulas associados.
*   **Integração:** O manipulador da API no Next.js será modificado para processar os novos campos e interagir com a tabela `student_schedules`.

#### **Requisição (Exemplo de Payload)**
```json
{
  "student_id": "uuid-do-aluno",
  "course_id": "uuid-do-curso",
  "start_date": "2025-08-01",
  "modality": "in-person",
  "schedules": [
    {
      "instructor_id": "uuid-do-instrutor",
      "day_of_week": 2,
      "start_time": "10:00:00",
      "end_time": "11:00:00"
    },
    {
      "instructor_id": "uuid-do-instrutor",
      "day_of_week": 4,
      "start_time": "10:00:00",
      "end_time": "11:00:00"
    }
  ]
}
```

#### **Resposta (Exemplo de Sucesso - 201 Created)**
```json
{
  "id": "uuid-da-matricula",
  "student_id": "uuid-do-aluno",
  "course_id": "uuid-do-curso",
  "start_date": "2025-08-01",
  "end_date": "2025-08-28",
  "modality": "in-person",
  "schedules": [
    {
      "id": "uuid-do-agendamento-1",
      "instructor_id": "uuid-do-instrutor",
      "day_of_week": 2,
      "start_time": "10:00:00",
      "end_time": "11:00:00"
    },
    {
      "id": "uuid-do-agendamento-2",
      "instructor_id": "uuid-do-instrutor",
      "day_of_week": 4,
      "start_time": "10:00:00",
      "end_time": "11:00:00"
    }
  ]
}
```
---