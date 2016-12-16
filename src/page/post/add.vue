<template>
    <el-row>
        <el-col :span="16">
            <textarea name="" v-model="form.content" id="" cols="30" rows="10"></textarea>
        </el-col>
        <el-col :span="8">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="文章标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="选择分类">
                    <el-select v-model="form.category" placeholder="请选择文章分类">
                        <el-option label="技术" value="技术"></el-option>
                        <el-option label="笔记" value="笔记"></el-option>
                        <el-option label="其它" value="其它"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择标签">
                    <el-select
                        v-model="form.tag"
                        multiple
                        filterable
                        allow-create
                        :multiple-limit="3"
                        placeholder="请选择文章标签">
                            <el-option
                            v-for="item in suggestions"
                            :label="item.value"
                            :value="item.value">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="立即发布">
                    <el-switch on-text="" off-text="" v-model="form.delivery"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
import API from '../../api'
export default {
    data() {
        return {
            form: {
                title: '',
                author: '',
                date: '',
                content: '',
                category: '',
                tag: [],
                delivery: false
            },
            state: '',
            suggestions: [
                {value: 'js'},
                {value: 'css'},
                {value: 'angular2'},
                {value: 'vue'},
                {value: 'sass'},
                {value: 'less'},
                {value: 'es6'},
                {value: 'es5'},
                {value: 'typescript'},
                {value: 'react'}
            ]
        }
    },
    mounted() {
        let id = this.$route.params.id
        if (id) {
            API.getById_post(id).then(res => {
                this.form = res.data.result
            })
        }
    },
    methods: {
        querySearch(queryString, cb) {
            var suggestions = this.suggestions;
            var results = queryString ? suggestions.filter(x => x.value.indexOf(queryString) > -1) : suggestions;
            cb(results);
        },
        handleSelect(item) {
            if (!this.form.tag.find(x => x === item.value)) {
                this.form.tag.push(item.value);
            }
            this.state = ''
        },
        handleClose(tag) {
            this.form.tag.splice(this.form.tag.indexOf(tag), 1)
        },
        onSubmit() {
            let req = this.form._id ? API.put_post(this.form) : API.post_post(this.form)
            req.then(res => {
                this.$router.push({path: '/post'})
                this.$message({
                    type: 'success',
                    message: '保存成功!'
                });
            })
        },
        onCancel() {
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
.line {
    text-align: center;
}
</style>