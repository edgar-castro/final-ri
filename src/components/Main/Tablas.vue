<template>
    <div class="tables-content">
        <div class="corpus-table">
            <div class="corpus-title">Representacion TF-IDF de los documentos</div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Termino</th>
                        <th v-for="doc in totalDocs" :key="doc">d<span class="index-min">{{doc}}</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="element in corpus_td_idf" :key="element.id">
                        <td> {{ element.id + 1 }}</td>
                        <td> {{ element.term }}</td>
                        <td v-for="(num, index) in element.weights" :key="index">
                            {{ num }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="corpus-table">
            <div class="corpus-title">Representacion TF-IDF de la consulta</div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th v-for="element in corpus_td_idf" :key="element.id">{{ element.id+1 }}</th>
                    </tr>
                    <tr>
                        <th>Termino</th>
                        <th v-for="element in corpus_td_idf" :key="element.id">{{ element.term }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th >Td-idf Consulta</th>
                        
                        <th v-for="(num, index) in arrayVector" :key="index">{{ num}}</th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="query-table">
            <div class="query-title">Similtud Coseno de Documentos con respecto a la consulta</div>
            <table>
                <thead>
                    <tr>
                        <th>Documentos</th>
                        <th v-for="doc in cosineVector" :key="doc.id">d<span class="index-min">{{doc.id+1}}</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Similitud Coseno</th>
                        <th v-for="element in cosineVector" :key="element.id">{{ element.weight}}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
        
</template>


<script lang="ts">
import { objDocWeight, objTFIDF,objDocVector } from '@/tf-idf';
import { computed, defineComponent } from 'vue';


export default defineComponent({
    props: {
        corpus_td_idf: {
            type: Array as () => objTFIDF[],
            required: true,
        },
        queryVector:{
            type:  Object as () => objDocVector,
            required: true,
        },
        cosineVector: {
            type: Array as () => objDocWeight[],
            required: true,
        },
    },
    setup(props) {
        const totalDocs = computed(() => {
            return props.corpus_td_idf[0]?.weights.length;
        })
        const arrayVector=computed(()=>{
            return props.queryVector.weights;
        })
        return {
            totalDocs,
            arrayVector,
        }
    }
});
</script>

<style lang="scss">
@import './main';
</style>