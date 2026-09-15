; ============================================
; Ejemplo 1: Suma de dos flotantes
; 3 + 2 = 5
; ============================================
; Este programa demuestra el uso básico del
; co-procesador FPU:
;   - FLD carga un valor en ST(0)
;   - FADD suma ST(0) + ST(1)
;   - FST guarda ST(0) en memoria
;
; Ejecuta con Step para ver cómo cambia el panel FPU.
; ============================================

        ORG 0000h

        FLD DATO1       ; ST(0) = 3
        FLD DATO2       ; ST(0) = 2, ST(1) = 3
        FADD            ; ST(0) = 5
        FST RESULT      ; guarda 5 en RESULT
        HLT

; --- Datos ---
DATO1:  DB 3
DATO2:  DB 2
RESULT: DB 0
