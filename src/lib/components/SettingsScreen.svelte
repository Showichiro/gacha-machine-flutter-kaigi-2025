<script lang="ts">
  import { prizesStore } from '../stores/prizes.svelte';
  import { PrizeService } from '../services/prizeService';
  import type { Prize, AddPrizeRequest, UpdatePrizeRequest } from '../types';

  // Props: イベントコールバック
  let { onnavigate }: { onnavigate?: (event: CustomEvent<{ screen: 'gacha' }>) => void } = $props();

  // サービスの初期化
  const prizeService = new PrizeService();

  // フォーム状態
  let showForm = $state(false);
  let editingPrizeId = $state<string | null>(null);
  let formData = $state({
    name: '',
    imageUrl: '',
    stock: 0,
  });

  // バリデーションエラー
  let errors = $state({
    name: '',
    stock: '',
  });

  // 削除確認ダイアログ
  let showDeleteConfirm = $state(false);
  let deletingPrizeId = $state<string | null>(null);

  // ガチャ画面に戻る
  function navigateToGacha() {
    onnavigate?.(new CustomEvent('navigate', { detail: { screen: 'gacha' } }));
  }

  // 追加フォームを開く
  function openAddForm() {
    showForm = true;
    editingPrizeId = null;
    formData = {
      name: '',
      imageUrl: '',
      stock: 0,
    };
    errors = {
      name: '',
      stock: '',
    };
  }

  // 編集フォームを開く
  function openEditForm(prize: Prize) {
    showForm = true;
    editingPrizeId = prize.id;
    formData = {
      name: prize.name,
      imageUrl: prize.imageUrl,
      stock: prize.stock,
    };
    errors = {
      name: '',
      stock: '',
    };
  }

  // フォームを閉じる
  function closeForm() {
    showForm = false;
    editingPrizeId = null;
    formData = {
      name: '',
      imageUrl: '',
      stock: 0,
    };
    errors = {
      name: '',
      stock: '',
    };
  }

  // バリデーション
  function validate(): boolean {
    let isValid = true;
    errors = {
      name: '',
      stock: '',
    };

    if (!formData.name.trim()) {
      errors.name = '景品名を入力してください';
      isValid = false;
    } else if (formData.name.trim().length > 50) {
      errors.name = '景品名は50文字以内で入力してください';
      isValid = false;
    }

    if (formData.stock < 0) {
      errors.stock = '在庫数は0以上の数値を入力してください';
      isValid = false;
    } else if (!Number.isInteger(formData.stock)) {
      errors.stock = '在庫数は整数で入力してください';
      isValid = false;
    } else if (formData.stock > 9999) {
      errors.stock = '在庫数は9999以下で入力してください';
      isValid = false;
    }

    return isValid;
  }

  // 保存
  function save() {
    if (!validate()) {
      return;
    }

    if (editingPrizeId) {
      // 更新
      const updateRequest: UpdatePrizeRequest = {
        id: editingPrizeId,
        name: formData.name,
        imageUrl: formData.imageUrl,
        stock: formData.stock,
      };
      prizeService.updatePrize(updateRequest);
    } else {
      // 追加
      const addRequest: AddPrizeRequest = {
        name: formData.name,
        imageUrl: formData.imageUrl,
        stock: formData.stock,
      };
      prizeService.addPrize(addRequest);
    }

    closeForm();
  }

  // 削除確認ダイアログを開く
  function openDeleteConfirm(prizeId: string) {
    showDeleteConfirm = true;
    deletingPrizeId = prizeId;
  }

  // 削除確認ダイアログを閉じる
  function closeDeleteConfirm() {
    showDeleteConfirm = false;
    deletingPrizeId = null;
  }

  // 削除実行
  function confirmDelete() {
    if (deletingPrizeId) {
      prizeService.deletePrize(deletingPrizeId);
    }
    closeDeleteConfirm();
  }
</script>

<div class="settings-screen" data-testid="settings-screen">
  <!-- ヘッダー: 戻るボタン -->
  <header class="header">
    <button
      class="back-button"
      data-testid="back-button"
      onclick={navigateToGacha}
    >
      ← 戻る
    </button>
    <h1>景品設定</h1>
  </header>

  <!-- メインコンテンツ -->
  <main class="main-content">
    <!-- 景品追加ボタン -->
    <div class="add-button-container">
      <button
        class="add-prize-button"
        data-testid="add-prize-button"
        onclick={openAddForm}
      >
        + 景品を追加
      </button>
    </div>

    <!-- 景品一覧 -->
    {#if prizesStore.prizes.length === 0}
      <div class="empty-message">
        <p>景品が登録されていません</p>
      </div>
    {:else}
      <ul class="prize-list">
        {#each prizesStore.prizes as prize, index (prize.id)}
          <li class="prize-item">
            <div class="prize-info">
              <img src={prize.imageUrl} alt={prize.name} class="prize-image" />
              <div class="prize-details">
                <h3>{prize.name}</h3>
                <p>在庫: {prize.stock}</p>
              </div>
            </div>
            <div class="prize-actions">
              <button
                class="edit-button"
                data-testid="edit-prize-button-{index}"
                onclick={() => openEditForm(prize)}
              >
                編集
              </button>
              <button
                class="delete-button"
                data-testid="delete-prize-button-{index}"
                onclick={() => openDeleteConfirm(prize.id)}
              >
                削除
              </button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </main>

  <!-- 景品追加・編集フォーム -->
  {#if showForm}
    <div class="modal-overlay">
      <div class="modal-content">
        <form class="prize-form" data-testid="prize-form" onsubmit={(e) => { e.preventDefault(); save(); }}>
          <h2>{editingPrizeId ? '景品を編集' : '景品を追加'}</h2>

          <div class="form-group">
            <label for="name">景品名 *</label>
            <input
              type="text"
              id="name"
              bind:value={formData.name}
            />
            {#if errors.name}
              <p class="error-message">{errors.name}</p>
            {/if}
          </div>

          <div class="form-group">
            <label for="imageUrl">画像URL</label>
            <input
              type="text"
              id="imageUrl"
              bind:value={formData.imageUrl}
            />
          </div>

          <div class="form-group">
            <label for="stock">在庫数 *</label>
            <input
              type="number"
              id="stock"
              bind:value={formData.stock}
            />
            {#if errors.stock}
              <p class="error-message">{errors.stock}</p>
            {/if}
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-button" onclick={closeForm}>
              キャンセル
            </button>
            <button type="submit" class="save-button">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- 削除確認ダイアログ -->
  {#if showDeleteConfirm}
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="confirm-dialog">
          <h2>確認</h2>
          <p>この景品を削除してもよろしいですか？</p>
          <div class="dialog-actions">
            <button class="cancel-button" onclick={closeDeleteConfirm}>
              キャンセル
            </button>
            <button class="delete-button" onclick={confirmDelete}>
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .settings-screen {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--color-bg-contents-area);
  }

  .header {
    padding: 1rem;
    background-color: var(--color-bg-white);
    border-bottom: 1px solid var(--color-border-low);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .back-button {
    padding: 0.5rem 1rem;
    background-color: var(--color-bg-white);
    border: 1px solid var(--color-border-back-btn);
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    color: var(--color-text-high);
  }

  .back-button:hover {
    background-color: var(--color-option-highlight);
  }

  h1 {
    font-size: 1.5rem;
    color: var(--color-text-high);
    margin: 0;
  }

  .main-content {
    flex: 1;
    padding: 2rem;
  }

  .add-button-container {
    margin-bottom: 2rem;
  }

  .add-prize-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    background-color: var(--color-brand-assign-red);
    color: var(--color-text-white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .add-prize-button:hover {
    opacity: 0.9;
  }

  .empty-message {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-middle);
  }

  .prize-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .prize-item {
    background-color: var(--color-bg-white);
    border: 1px solid var(--color-border-low);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: box-shadow 0.2s;
  }

  .prize-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .prize-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .prize-image {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 4px;
  }

  .prize-details h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    color: var(--color-text-high);
  }

  .prize-details p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-middle);
  }

  .prize-actions {
    display: flex;
    gap: 0.5rem;
  }

  .edit-button,
  .delete-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .edit-button {
    background-color: var(--color-bg-white);
    border: 1px solid var(--color-border-low);
    color: var(--color-text-high);
  }

  .edit-button:hover {
    background-color: var(--color-option-highlight);
  }

  .delete-button {
    background-color: var(--color-accent-red);
    border: none;
    color: var(--color-text-white);
  }

  .delete-button:hover {
    opacity: 0.9;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: var(--color-bg-white);
    border-radius: 8px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
  }

  .prize-form h2,
  .confirm-dialog h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    color: var(--color-text-high);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: bold;
    color: var(--color-text-high);
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid var(--color-border-low);
    border-radius: 4px;
    background-color: var(--color-bg-low);
  }

  .error-message {
    margin: 0.5rem 0 0 0;
    font-size: 0.75rem;
    color: var(--color-accent-red);
  }

  .form-actions,
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }

  .cancel-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: var(--color-bg-white);
    border: 1px solid var(--color-border-low);
    border-radius: 4px;
    cursor: pointer;
    color: var(--color-text-high);
  }

  .cancel-button:hover {
    background-color: var(--color-option-highlight);
  }

  .save-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    background-color: var(--color-brand-assign-red);
    color: var(--color-text-white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .save-button:hover {
    opacity: 0.9;
  }

  .confirm-dialog p {
    margin: 0 0 1.5rem 0;
    color: var(--color-text-high);
  }

  /* レスポンシブデザイン */
  @media (max-width: 768px) {
    .main-content {
      padding: 1.5rem;
    }

    .modal-content {
      max-width: 95%;
      padding: 1.5rem;
    }

    .prize-item {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .prize-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  @media (max-width: 480px) {
    .header {
      padding: 0.75rem;
    }

    h1 {
      font-size: 1.25rem;
    }

    .main-content {
      padding: 1rem;
    }

    .prize-image {
      width: 48px;
      height: 48px;
    }

    .form-group input {
      padding: 0.5rem;
      font-size: 0.875rem;
    }
  }
</style>
