import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Utilidad para leer y procesar archivos Excel (.xlsx).
 */
export class ExcelHelper {
    /**
     * Lee un archivo Excel y retorna los datos de la hoja especificada
     * como un array de objetos (cada fila es un objeto con las cabeceras como claves).
     */
    static readSheet<T = Record<string, any>>(
        filePath: string,
        sheetName?: string,
    ): T[] {
        const absolutePath = path.resolve(filePath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`Archivo Excel no encontrado: ${absolutePath}`);
        }

        const workbook = XLSX.readFile(absolutePath);

        // Si no se especifica hoja, usar la primera
        const targetSheet = sheetName || workbook.SheetNames[0];

        if (!workbook.SheetNames.includes(targetSheet)) {
            throw new Error(
                `Hoja "${targetSheet}" no encontrada. Hojas disponibles: ${workbook.SheetNames.join(', ')}`,
            );
        }

        const worksheet = workbook.Sheets[targetSheet];
        return XLSX.utils.sheet_to_json<T>(worksheet);
    }

    /**
     * Retorna los nombres de todas las hojas del archivo Excel.
     */
    static getSheetNames(filePath: string): string[] {
        const absolutePath = path.resolve(filePath);
        const workbook = XLSX.readFile(absolutePath);
        return workbook.SheetNames;
    }

    /**
     * Lee múltiples hojas y retorna un mapa { nombreHoja: datos[] }.
     */
    static readAllSheets<T = Record<string, any>>(
        filePath: string,
    ): Record<string, T[]> {
        const absolutePath = path.resolve(filePath);
        const workbook = XLSX.readFile(absolutePath);
        const result: Record<string, T[]> = {};

        for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            result[sheetName] = XLSX.utils.sheet_to_json<T>(worksheet);
        }

        return result;
    }
}
