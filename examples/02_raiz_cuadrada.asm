; ============================================
; Ejemplo 2: Raíz cuadrada
; sqrt(16) = 4
; ============================================
; Demuestra la instrucción FSQRT del co-procesador.
; ============================================

        ORG 0000h

        FLD NUM         ; ST(0) = 16
        FSQRT           ; ST(0) = 4
        FST RES         ; guarda 4 en RES
        HLT

NUM:    DB 16
RES:    DB 0
