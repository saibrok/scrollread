<script setup>
import SrButton from '../../../ui/SrButton.vue';
import SrModal from '../../../ui/SrModal.vue';

const props = defineProps({
    saveConfirmOpen: {
        type: Boolean,
        required: true,
    },
    loadConfirmOpen: {
        type: Boolean,
        required: true,
    },
    deleteConfirmOpen: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits([
    'close-save-confirm',
    'confirm-save-overwrite',
    'confirm-save-new',
    'close-load-confirm',
    'confirm-load-replace',
    'close-delete-confirm',
    'confirm-delete-save',
]);
</script>

<template>
    <SrModal
        :open="props.saveConfirmOpen"
        card-class="sr-modal-card--compact"
        @close="emit('close-save-confirm')"
    >
        <div class="sr-modal-header">
            <div>Сохранение текста</div>
        </div>
        <div class="sr-modal-body">
            <div class="sr-modal-text">Выберите действие для выбранного сохранения.</div>
            <div class="sr-modal-actions">
                <SrButton
                    variant="default"
                    @click="emit('close-save-confirm')"
                >
                    Отмена
                </SrButton>

                <SrButton
                    variant="default"
                    @click="emit('confirm-save-overwrite')"
                >
                    Перезаписать
                </SrButton>

                <SrButton
                    variant="accent"
                    @click="emit('confirm-save-new')"
                >
                    Новое
                </SrButton>
            </div>
        </div>
    </SrModal>

    <SrModal
        :open="props.loadConfirmOpen"
        card-class="sr-modal-card--compact"
        @close="emit('close-load-confirm')"
    >
        <div class="sr-modal-header">
            <div>Загрузка текста</div>
        </div>
        <div class="sr-modal-body">
            <div class="sr-modal-text">В поле есть данные. Заменить содержимое?</div>
            <div class="sr-modal-actions">
                <SrButton
                    variant="default"
                    @click="emit('close-load-confirm')"
                >
                    Отмена
                </SrButton>
                <SrButton
                    variant="accent"
                    @click="emit('confirm-load-replace')"
                >
                    Заменить
                </SrButton>
            </div>
        </div>
    </SrModal>

    <SrModal
        :open="props.deleteConfirmOpen"
        card-class="sr-modal-card--compact"
        @close="emit('close-delete-confirm')"
    >
        <div class="sr-modal-header">
            <div>Удаление сохранения</div>
        </div>
        <div class="sr-modal-body">
            <div class="sr-modal-text">Удалить выбранное сохранение без возможности восстановления?</div>
            <div class="sr-modal-actions">
                <SrButton
                    variant="default"
                    @click="emit('close-delete-confirm')"
                >
                    Отмена
                </SrButton>
                <SrButton
                    variant="accent"
                    @click="emit('confirm-delete-save')"
                >
                    Удалить
                </SrButton>
            </div>
        </div>
    </SrModal>
</template>
