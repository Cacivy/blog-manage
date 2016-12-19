<template>
    <el-row :gutter="12">
        <el-col :span="16">
            <editor v-model="form.content"></editor>
        </el-col>
        <el-col :span="8">
            <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="选择分类" prop="category">
                    <el-select v-model="form.category" placeholder="请选择文章分类">
                        <el-option 
                        v-for="category in categories" 
                        :label="category.text" 
                        :value="category.text">
                        </el-option>
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
                            :label="item.text"
                            :value="item.text">
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
import editor from '../../components/editor'
import API from '../../api'
export default {
    components: {editor},
    data() {
        return {
            form: {
                title: '',
                author: '',
                date: Date.now(),
                content: '',
                category: '',
                tag: [],
                delivery: false
            },
            rules: {
                title: [
                     { required: true, message: '请输入文章标题', trigger: 'blur' }
                ],
                category: [
                    { required: true, message: '请选择分类', trigger: 'blur' }
                ]
            },
            state: '',
            suggestions: [],
            categories: []
        }
    },
    mounted() {
        let id = this.$route.params.id
        if (id) {
            API.getById_post(id).then(res => {
                this.form = res.data.result
            })
        }
        API.get_tag().then(res => {
            this.suggestions = res.data.result
        })
        API.get_category().then(res => {
            this.categories = res.data.result
        })
    },
    methods: {
        querySearch(queryString, cb) {
            var suggestions = this.suggestions;
            var results = queryString ? suggestions.filter(x => x.text.indexOf(queryString) > -1) : suggestions;
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
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let req = this.form._id ? API.put_post(this.form) : API.post_post(this.form)
                    req.then(res => {
                        this.$router.push({path: '/post'})
                        this.$message({
                            type: 'success',
                            message: '保存成功!'
                        });
                    })
                } else {
                   
                }
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