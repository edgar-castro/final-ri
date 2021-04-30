<template>
    <div class="search-container">
        <div class="search-inputs">
            <InputText
                :placeholder="'Ingrese su busqueda'"
                :value="query"
                v-model="query"
            />
            <Button
                :text="'Buscar'"
                :onClickFunction="execQuery"
            />
            <Button
                :text="'Reiniciar'"
                :onClickFunction="reset"
            />
        </div>
    </div>
    <div class="tabs-items">
        <Radio
            :optionsList="tabsOptions"
            :value="tabOption"
            v-model="tabOption"
        />
    </div>
    <div class="tab-content">
        <Noticias v-show="tabOption === 'Noticias'"
            :iterable="newsList"
        />
        <Tablas v-show="tabOption === 'Tablas'"
            :corpus_td_idf="corupus_tf_idf" 
            :cosineVector="cosineVector"
            :queryVector="queryVector"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import Button from '@/components/Button/Button.vue';
import InputText from '@/components/InputText/InputText.vue';
import Radio from '@/components/Radio/Radio.vue';

import Noticias from '@/components/Main/Noticias.vue';
import Tablas from  '@/components/Main/Tablas.vue';
import { getCorpus, getWords, get_f, get_idf, get_tf_idf, objDocWeight, objNoticia, objTFIDF, objDocVector, getQueryVector, getCosineSimilarity, processCorpus } from '@/tf-idf';
import { test_input } from '@/input';

export default defineComponent({
    components: {
        Button,
        InputText,
        Noticias,
        Tablas,
        Radio,
    },
    setup() {

        //------[VARIABLES]------
        //Variable encargada de manejar la entrada de texto
        const query = ref<string>('');
        const input_corpus = ref<objNoticia[]>([]);
        const processed_corpus = ref<objNoticia []>([]);
        const corupus_tf_idf = ref<objTFIDF[]>([]);
        const corpus_idf = ref<number [][]>([]);
        const query_tf_idf = ref<objTFIDF[]>([]);
        const results = ref<objNoticia[]>([]);
        const queryVector = ref<objDocVector>({ id: 0, weights: [] });
        const cosineVector = ref<objDocWeight []>([]);

        const tabsOptions = ['Noticias', 'Tablas'];
        const tabOption = ref<string>('Noticias');

        const newsList = computed(() => {
            return (results.value.length > 0) ? results.value : input_corpus.value;
        });

        onMounted(() => {
            input_corpus.value = getCorpus(test_input);
            console.log('Corpus original: ', input_corpus.value[4].title + input_corpus.value[4].content);
            processed_corpus.value = processCorpus(input_corpus.value);
            console.log('Corpus procesado: ', processed_corpus.value[4] + processed_corpus.value[4].content);
            const corpus_words = getWords(processed_corpus.value);
            const local_corpus_idf = localStorage.getItem('corpus-idf');
            corpus_idf.value = (local_corpus_idf === null) ?
                get_idf(get_f(processed_corpus.value, corpus_words), corpus_words) :
                JSON.parse(local_corpus_idf);
            if(local_corpus_idf === null) localStorage.setItem('corpus-idf', JSON.stringify(corpus_idf.value));
            const local_corpus_tf_idf = localStorage.getItem('corpus-tf-idf');
            corupus_tf_idf.value = (local_corpus_tf_idf === null) ?
                get_tf_idf(processed_corpus.value, corpus_words):
                JSON.parse(local_corpus_tf_idf);
            if(local_corpus_tf_idf === null) localStorage.setItem('corpus-tf-idf', JSON.stringify(corupus_tf_idf.value));
        });

        //------[FUNCIONES]------
        
        const execQuery = () => {
            //const query_words = preprocessDocument(query.value).split(' ').filter(x => !x.match(/\s+/g));
            results.value = [];
            queryVector.value = getQueryVector(processed_corpus.value, query.value, getWords(processed_corpus.value), corpus_idf.value);
            cosineVector.value = getCosineSimilarity(corupus_tf_idf.value, queryVector.value);
            //const query_weights = getQueryWeights(query_tf_idf.value).sort((a, b) => b.weight - a.weight);
            results.value = getQueryResults(cosineVector.value.filter(x => x.weight > 0));
            if(results.value.length <= 0) {
                alert('No se encontro alguna coincidencia con lo buscado');
                query.value = '';
            }
        }

        const reset = () => {
            console.log(query.value);
            query_tf_idf.value = [];
            results.value = [];
            query.value = '';
        }

        const getQueryResults = (weights: objDocWeight[]): objNoticia[] => {
            const temp: objNoticia[] = [];
            for(let i = 0; i < weights.length; i++)
                temp.push(input_corpus.value[weights[i].id]);
            return temp;
        }

        return {
            query,
            input_corpus,
            results,
            tabsOptions,
            tabOption,
            reset,
            execQuery,
            newsList,
            corupus_tf_idf,
            query_tf_idf,
            cosineVector,
            queryVector,
        }
    }
})
</script>

<style lang="scss">
@import './main';
</style>