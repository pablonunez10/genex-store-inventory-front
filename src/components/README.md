# Componentes Reutilizables

## Input

Componente de input con fondo gris, texto negro y label separado.

### Uso:

```tsx
import { Input } from '../components';

<Input
  label="Email"
  type="email"
  placeholder="email@ejemplo.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

### Props:
- `label` (opcional): Texto del label
- `error` (opcional): Mensaje de error a mostrar
- Todos los props estándar de `<input>` HTML

---

## Select

Componente de select con fondo gris, texto negro y label separado.

### Uso:

```tsx
import { Select } from '../components';

<Select
  label="Producto"
  value={productId}
  onChange={(e) => setProductId(e.target.value)}
  required
>
  <option value="">Seleccionar producto</option>
  <option value="1">Producto 1</option>
  <option value="2">Producto 2</option>
</Select>
```

### Props:
- `label` (opcional): Texto del label
- `error` (opcional): Mensaje de error a mostrar
- `children`: Opciones del select
- Todos los props estándar de `<select>` HTML

---

## TextArea

Componente de textarea con fondo gris, texto negro y label separado.

### Uso:

```tsx
import { TextArea } from '../components';

<TextArea
  label="Descripción"
  placeholder="Ingrese una descripción..."
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
/>
```

### Props:
- `label` (opcional): Texto del label
- `error` (opcional): Mensaje de error a mostrar
- Todos los props estándar de `<textarea>` HTML

---

## Estilo

Todos los componentes tienen:
- Fondo gris (`bg-gray-200`)
- Texto negro (`text-black`)
- Placeholder gris (`placeholder:text-gray-500`)
- Borde gris (`border-gray-300`)
- Focus con borde gris oscuro (`focus:border-gray-400`)
- Labels en negrita (`font-medium`)
