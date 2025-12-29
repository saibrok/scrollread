<script setup>
import SrExpansionPanel from '../../ui/SrExpansionPanel.vue';
</script>

<template>
    <section
        id="faq"
        class="section reveal"
        style="--delay: 0.3s"
    >
        <div class="section-title">Часто задаваемые вопросы</div>
        <div class="faq">
            <SrExpansionPanel title="Нужно ли регистрироваться или устанавливать приложение?">
                Нет. ScrollRead работает в браузере и запускается сразу.
            </SrExpansionPanel>
            <SrExpansionPanel title="Где хранятся мои тексты?">
                Сохранения остаются в локальном хранилище браузера и не отправляются на сервер.
            </SrExpansionPanel>
            <SrExpansionPanel title="Можно ли пользоваться на телефоне или планшете?">
                Да, интерфейс адаптивен и подходит для мобильных устройств.
            </SrExpansionPanel>
            <SrExpansionPanel title="Как рассчитывается скорость чтения?">
                Скорость задается в знаках в минуту, а оценка времени считается автоматически.
            </SrExpansionPanel>
        </div>
    </section>
</template>
