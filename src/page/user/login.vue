<template>
    <div id="login">
        <h3>Login</h3>
        <el-form label-width="80px" :model="userinfo" :rules="rules" ref="loginForm" class="login-form">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="userinfo.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="userinfo.password" @keyup.native.enter="onSubmit" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="loading" @click="onSubmit">{{loading ? '登录中' : '登录'}}</el-button>
                <el-button @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data () {
        return {
            userinfo: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            loading: false
        }
    },
    mounted() {
        this.$message({
            type: 'info',
            message: 'Welcome! default user: admin'
        })
    },
    methods: {
        onSubmit() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.$api.post_user_login(this.userinfo).then((res) => {
                        if (res.data.error) {
                            this.$message({
                                type: 'error',
                                message: res.data.msg
                            })
                            this.loading = false
                        } else {
                            this.$message({
                                type: 'success',
                                message: '登录成功'
                            })
                            this.$store.dispatch('setUser', res.data.result)
                            this.$router.push({name: 'home'})
                        }
                    }).catch((res) => {
                        this.loading = false
                    })
                } else {
                    return false;
                }
            });
        },
        onReset() {
            this.$refs.loginForm.resetFields();
        }
    }
}
</script>

<style lang="scss" scoped>
    #login {
        width: 400px;
        margin: 10% auto 0 auto;
        padding: 20px 20px 0 0;
        border: 1px solid #eaeefb;
        border-radius: 4px;
        transition: .2s;

        &:hover {
            box-shadow: 0 0 10px 0 rgba(232,237,250,.6), 0 4px 6px 0 rgba(232,237,250,.5);
        }

        h3 {
            text-align: center;
        }
        
        small {
            text-align: center;
        }

        .login-form {
            margin-top: 20px;
        }
    }
</style>