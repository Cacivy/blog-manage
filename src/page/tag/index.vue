<template>
    <div id="tag">
        <el-row :gutter="12">
            <el-col :span="6">
                <el-input
                placeholder="请输入标签名称"
                @keyup.enter.native="onCommit"
                v-model="input">
                </el-input>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" icon="edit" @click="onCommit()">添加标签</el-button>
            </el-col>
        </el-row>
        <el-tag 
        v-for="tag, index in tags"
        :closable="true"
        :hit="true"
        class="el-tag-custome"
        @close="onClose(tag._id, index)">
            {{tag.text}}
        </el-tag>
    </div>
</template>

<script>
import API from '../../api'
export default {
    data() {
        return {
            input: '',
            tags: [],
            total: 0
        }
    },
    mounted() {
        API.get_tag().then(res => {
            this.tags = res.data.result
            this.total = res.data.total
        })
    },
    methods: {
        onCommit() {
            API.post_tag({text: this.input}).then(res => {
                this.tags.push(res.data.result)
                this.input = ''
                this.$message({
                    type: 'success',
                    message: '已添加'
                });
            })
        },
        onClose(id, index) {
            this.$confirm('确定删除吗?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                API.delete_tag(id).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.tags.splice(index, 1)
                })
            })
        }
    }
}
</script>