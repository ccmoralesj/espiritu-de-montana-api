import { Adventure, Category, Difficulty, IncludeItem } from "../../types/adventure";
import { AirtableRecord } from "./consts";

export function mapRecordToIncludeItem(record: AirtableRecord): IncludeItem {
  const campos = record.fields;

  return {
    id: record.id,
    name: campos['Nombre'],
    reactItem: campos['Ítem']
  };
}

export function mapRecordToAdventure(adventureRecord: AirtableRecord): Adventure {
  const campos = adventureRecord.fields;
  const attachment = (campos['Foto de Portada']?.[0]) ?? {};

  return {
    id: adventureRecord.id,
    title: campos['Nombre'] ?? '',
    firstDate: campos['1ra Fecha del Evento'] ?? '',
    secondDate: campos['2da Fecha del Evento'] ?? '',
    duration: campos['Estadía (días)'],
    totalDistance: campos['Kilometraje Total'],
    location: campos['Ubicación'] ?? '',
    shortDescription: campos['Descripción Corta'] ?? '',
    longDescription: campos['Descripción Larga'] ?? '',
    image: {
      thumbnail: attachment.thumbnails?.small?.url ?? '',
      large: attachment.thumbnails?.large?.url ?? '',
      full: attachment.url ?? ''
    },
    difficulty: (campos['Dificultad'] as Difficulty) ?? 'Intermedio',
    price: campos['Costo']?.toString(),
    alternativePrice: campos['Costo Alternativo']?.toString(),
    currency: campos['Moneda']?.toString(),
    category: (campos['NombreTipo']?.[0] as Category) ?? 'local',
    capacity: parseInt(campos['Capacidad']?.toString() ?? '0', 10),
    riders: parseInt(campos['Clientes inscritos']?.length?.toString() ?? '0', 10),
    included: campos['Incluye']?.map(mapRecordToIncludeItem)?? [],
    notIncluded: campos['NO Incluye']?.map(mapRecordToIncludeItem)?? [],
  };
}


export function upcomingAndSorted(adventures: Adventure[]) {
  const now = new Date();
  return adventures
  .filter(adventure => new Date(adventure.firstDate) >= now)
  .sort((a, b) => {
    const da = new Date(a.firstDate).getTime();
    const db = new Date(b.firstDate).getTime();
    if (da !== db) return da - db;
    const pa = a.riders / a.capacity;
    const pb = b.riders / b.capacity;
    return pb - pa;
  });
}

export function buildDateFilter(from?: string, to?: string): string | undefined {
  const parts = [];
  if (from) parts.push(`{1ra Fecha del Evento} >= ${from}`);
  if (to) parts.push(`{1ra Fecha del Evento} <= ${to}`);
  if (!parts.length) return undefined;
  return parts.length === 1 ? parts[0] : `AND(${parts.join(', ')})`;
}