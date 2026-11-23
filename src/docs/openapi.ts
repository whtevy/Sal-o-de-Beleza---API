export const openApi = {
  "openapi": "3.0.3",
  "info": {
    "title": "Salão de Beleza API",
    "version": "2.0.0",
    "description": "CRUD de categorias, serviços, profissionais e agendamentos"
  },
  "servers": [
    {
      "url": "http://localhost:3000"
    }
  ],
  "components": {
    "schemas": {
      "Category": {
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "active": {
            "type": "boolean"
          }
        }
      },
      "Service": {
        "type": "object",
        "required": [
          "category_id",
          "name",
          "price",
          "duration_minutes"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "category_id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "price": {
            "type": "number",
            "minimum": 0
          },
          "duration_minutes": {
            "type": "integer",
            "minimum": 1
          },
          "active": {
            "type": "boolean"
          }
        }
      },
      "Professional": {
        "type": "object",
        "required": [
          "name",
          "specialty"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string"
          },
          "specialty": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "active": {
            "type": "boolean"
          }
        }
      },
      "Appointment": {
        "type": "object",
        "required": [
          "service_id",
          "professional_id",
          "client_name",
          "client_phone",
          "appointment_date",
          "appointment_time"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "service_id": {
            "type": "string",
            "format": "uuid"
          },
          "professional_id": {
            "type": "string",
            "format": "uuid"
          },
          "client_name": {
            "type": "string"
          },
          "client_phone": {
            "type": "string"
          },
          "appointment_date": {
            "type": "string",
            "format": "date"
          },
          "appointment_time": {
            "type": "string",
            "example": "14:30"
          },
          "status": {
            "type": "string",
            "enum": [
              "agendado",
              "concluido",
              "cancelado"
            ]
          }
        }
      }
    }
  },
  "paths": {
    "/categories": {
      "get": {
        "tags": [
          "Category"
        ],
        "summary": "Listar categories",
        "responses": {
          "200": {
            "description": "Lista",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Category"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Category"
        ],
        "summary": "Criar Category",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Category"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Category"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      }
    },
    "/categories/{id}": {
      "get": {
        "tags": [
          "Category"
        ],
        "summary": "GET Category",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Category"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "404": {
            "description": "Não encontrado"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      },
      "put": {
        "tags": [
          "Category"
        ],
        "summary": "PUT Category",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Category"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Category"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "404": {
            "description": "Não encontrado"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      },
      "delete": {
        "tags": [
          "Category"
        ],
        "summary": "DELETE Category",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Excluído"
          },
          "404": {
            "description": "Não encontrado"
          },
          "400": {
            "description": "Requisição inválida"
          }
        }
      }
    },
    "/services": {
      "get": {
        "tags": [
          "Service"
        ],
        "summary": "Listar services",
        "responses": {
          "200": {
            "description": "Lista",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Service"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Service"
        ],
        "summary": "Criar Service",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Service"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Service"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      }
    },
    "/services/{id}": {
      "get": {
        "tags": [
          "Service"
        ],
        "summary": "GET Service",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Service"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "404": {
            "description": "Não encontrado"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      },
      "put": {
        "tags": [
          "Service"
        ],
        "summary": "PUT Service",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Service"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Service"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "404": {
            "description": "Não encontrado"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      },
      "delete": {
        "tags": [
          "Service"
        ],
        "summary": "DELETE Service",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Excluído"
          },
          "404": {
            "description": "Não encontrado"
          },
          "400": {
            "description": "Requisição inválida"
          }
        }
      }
    },
    "/professionals": {
      "get": {
        "tags": [
          "Professional"
        ],
        "summary": "Listar professionals",
        "responses": {
          "200": {
            "description": "Lista",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Professional"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Professional"
        ],
        "summary": "Criar Professional",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Professional"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Professional"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      }
    },
    "/professionals/{id}": {
      "get": {
        "tags": [
          "Professional"
        ],
        "summary": "GET Professional",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Professional"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "404": {
            "description": "Não encontrado"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      },
      "put": {
        "tags": [
          "Professional"
        ],
        "summary": "PUT Professional",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Professional"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Professional"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "404": {
            "description": "Não encontrado"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      },
      "delete": {
        "tags": [
          "Professional"
        ],
        "summary": "DELETE Professional",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Excluído"
          },
          "404": {
            "description": "Não encontrado"
          },
          "400": {
            "description": "Requisição inválida"
          }
        }
      }
    },
    "/appointments": {
      "get": {
        "tags": [
          "Appointment"
        ],
        "summary": "Listar appointments",
        "responses": {
          "200": {
            "description": "Lista",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Appointment"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Appointment"
        ],
        "summary": "Criar Appointment",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Appointment"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Appointment"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      }
    },
    "/appointments/{id}": {
      "get": {
        "tags": [
          "Appointment"
        ],
        "summary": "GET Appointment",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Appointment"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "404": {
            "description": "Não encontrado"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      },
      "put": {
        "tags": [
          "Appointment"
        ],
        "summary": "PUT Appointment",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Appointment"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Appointment"
                }
              }
            }
          },
          "400": {
            "description": "Requisição inválida"
          },
          "404": {
            "description": "Não encontrado"
          },
          "409": {
            "description": "Conflito de horário"
          }
        }
      },
      "delete": {
        "tags": [
          "Appointment"
        ],
        "summary": "DELETE Appointment",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Excluído"
          },
          "404": {
            "description": "Não encontrado"
          },
          "400": {
            "description": "Requisição inválida"
          }
        }
      }
    }
  }
} as const;
