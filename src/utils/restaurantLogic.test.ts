import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getHavanaOpenStatus,
  validateReservationForm,
  buildWhatsAppReservationData,
  filterMenuItems,
  type MenuItem,
} from './restaurantLogic';

test('getHavanaOpenStatus returns open between 12:00 and 22:59', () => {
  const noon = getHavanaOpenStatus(12, 0);
  assert.equal(noon.isOpen, true);
  assert.equal(noon.badgeText, 'Abierto ahora · hasta las 11 p.m.');

  const dinner = getHavanaOpenStatus(20, 30);
  assert.equal(dinner.isOpen, true);
  assert.equal(dinner.badgeText, 'Abierto ahora · hasta las 11 p.m.');
});

test('getHavanaOpenStatus returns closed before 12:00 and at/after 23:00', () => {
  const morning = getHavanaOpenStatus(10, 15);
  assert.equal(morning.isOpen, false);
  assert.equal(morning.badgeText, 'Abre a las 12 p.m.');

  const lateNight = getHavanaOpenStatus(23, 0);
  assert.equal(lateNight.isOpen, false);
  assert.equal(lateNight.badgeText, 'Abre a las 12 p.m.');
});

test('validateReservationForm rejects empty fields and accepts valid input', () => {
  const invalid = validateReservationForm({
    name: '',
    date: '',
    time: '',
    guests: '0',
    occasion: '',
    dietaryNotes: '',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.date);
  assert.ok(invalid.errors.time);
  assert.ok(invalid.errors.guests);

  const valid = validateReservationForm({
    name: 'Elena Rodríguez',
    date: '2026-11-15',
    time: '8:00 p.m.',
    guests: '4',
    occasion: 'Cena en familia',
    dietaryNotes: '1 opción vegetariana',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('buildWhatsAppReservationData creates wa.me URL for +53 5 2686237 with availability inquiry', () => {
  const { message, whatsappUrl } = buildWhatsAppReservationData({
    name: 'Carlos Pérez',
    date: '2026-11-20',
    time: '7:30 p.m.',
    guests: '6',
    occasion: 'Celebración de grupo',
    dietaryNotes: 'Sin gluten',
  });

  assert.ok(message.includes('Carlos Pérez'));
  assert.ok(message.includes('2026-11-20'));
  assert.ok(message.includes('7:30 p.m.'));
  assert.ok(message.includes('6'));
  assert.ok(message.includes('Sin gluten'));
  assert.ok( whatsappUrl.startsWith('https://wa.me/5352686237?text='));
});

test('filterMenuItems filters by category and dietary tag accurately', () => {
  const sampleItems: MenuItem[] = [
    {
      id: '1',
      name: 'Costilla de Cerdo al Carbón',
      category: 'carbon',
      categoryLabel: 'A la Parrilla',
      description: 'Costilla asada a las brasas',
      priceStatus: '3370 CUP / lb [CONFIRMAR]',
      image: '/assets/aistudio/image_c52e79d0_b412d2da.webp',
      imageAlt: 'Costilla al carbón',
      dietary: ['carbon', 'sin-gluten'],
    },
    {
      id: '2',
      name: 'Berenjena del Huerto al Carbón',
      category: 'especialidades',
      categoryLabel: 'Del Huerto',
      description: 'Berenjena asada con hierbas',
      priceStatus: '[COMPLETAR: precio en CUP]',
      image: '/assets/aistudio/image_1ee0bc0a_0e919dc2.webp',
      imageAlt: 'Berenjena',
      dietary: ['vegetariano', 'vegano', 'sin-gluten'],
    },
  ];

  assert.equal(filterMenuItems(sampleItems, 'todas', 'todos').length, 2);
  assert.equal(filterMenuItems(sampleItems, 'carbon', 'todos').length, 1);
  assert.equal(filterMenuItems(sampleItems, 'todas', 'vegano').length, 1);
  assert.equal(filterMenuItems(sampleItems, 'carbon', 'vegano').length, 0);
});
