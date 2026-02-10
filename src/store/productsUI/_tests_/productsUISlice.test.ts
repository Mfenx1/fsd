import { describe, it, expect, vi } from 'vitest';
import { createProductsUISlice } from '../productsUISlice';

describe('createProductsUISlice', () => {
  const createSet = () => {
    const set = vi.fn();

    return set;
  };

  it('начальное состояние', () => {
    const set = createSet();
    const slice = createProductsUISlice(set);

    expect(slice.search).toBe('');
    expect(slice.toast).toBeNull();
    expect(slice.editing).toBeNull();
    expect(slice.addingNew).toBe(false);
  });

  it('setSearch обновляет search', () => {
    const set = createSet();
    const slice = createProductsUISlice(set);

    slice.setSearch('test query');

    expect(set).toHaveBeenCalledWith({ search: 'test query' }, false, 'setSearch');
  });

  it('setToast(строка) задаёт тост с сообщением', () => {
    const set = createSet();
    const slice = createProductsUISlice(set);

    slice.setToast('Success!');

    expect(set).toHaveBeenCalledWith({ toast: { message: 'Success!' } }, false, 'setToast');
  });

  it('setToast(объект) задаёт тост', () => {
    const set = createSet();
    const slice = createProductsUISlice(set);

    slice.setToast({ message: 'Error', variant: 'error' });

    expect(set).toHaveBeenCalledWith(
      { toast: { message: 'Error', variant: 'error' } },
      false,
      'setToast'
    );
  });

  it('setToast(null) сбрасывает тост', () => {
    const set = createSet();
    const slice = createProductsUISlice(set);

    slice.setToast(null);

    expect(set).toHaveBeenCalledWith({ toast: null }, false, 'setToast');
  });

  it('setEditing обновляет editing', () => {
    const set = createSet();
    const slice = createProductsUISlice(set);

    slice.setEditing({ id: 1, clientKey: 'temp-1' });

    expect(set).toHaveBeenCalledWith(
      { editing: { id: 1, clientKey: 'temp-1' } },
      false,
      'setEditing'
    );
  });

  it('setAddingNew обновляет addingNew', () => {
    const set = createSet();
    const slice = createProductsUISlice(set);

    slice.setAddingNew(true);

    expect(set).toHaveBeenCalledWith({ addingNew: true }, false, 'setAddingNew');
  });
});
