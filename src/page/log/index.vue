<template>
    <div id="log">
    <el-row :gutter="12" type="flex" justify="end">
      <el-col :span="0">
        <el-row :gutter="12" type="flex">
            <el-select v-model="filterType" style="width: 120px;" placeholder="请选择">
                  <el-option
                    v-for="item in filterOptions"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
          <el-col :span="0">
            <el-input
              v-model="filterText">
            </el-input>
          </el-col>
          <el-col :span="0">
            <el-date-picker
              v-model="datetime"
              type="daterange"
              align="right"
              style="width: 220px"
              :picker-options="pickerOptions"
              placeholder="选择日期范围"
              >
            </el-date-picker>
          </el-col>
          <el-col :span="0">
            <el-button type="primary" icon="search" @click="onSearch">查询</el-button>
            <el-button type="danger" @click="onReset">重置</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
        <el-table
        :data="tableData"
        v-loading.body="loading"
        style="width: 100%">
            <el-table-column
                type="index"
                width="80">
            </el-table-column>
            <el-table-column
                inline-template
                prop="time"
                label="日期"
                width="210">
                 <div>
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px">{{ row.time | time }}</span>
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                prop="url"
                label="请求地址"
                width="340">
                <div class="text-overflow" :title="row.url">
                    {{row.url}}
                </div>
            </el-table-column>
            <el-table-column
                inline-template
                prop="type"
                label="类型"
                :filters="[{text: 'error', value: 'error'}, {text: 'info', value: 'info'}]"
                :filter-method="filterLogType"
                width="100">
                <div>
                    {{row.type}}
                </div>
            </el-table-column>
             <el-table-column
                inline-template
                prop="msg"
                label="日志内容">
                <div>
                    {{row.msg}}
                </div>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" class="row-page">
            <el-col :span="0">
                <el-pagination
                @current-change="handleCurrentChange"
                :current-page="pageConfig.currentPage"
                :page-size="pageConfig.pageSize"
                layout="total, prev, pager, next"
                :total="pageConfig.total">
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import moment from 'moment'
import API from '../../api'
import {pickerOptions} from '../../utils/date'
export default {
    data() {
        return {
            tableData: [],
            loading: true,
            filterText: '',
            filterType: 'url',
            filterOptions: [{
                label: '请求地址',
                value: 'url'
            }, {
                label: '日志内容',
                value: 'msg'
            }],
            pickerOptions: pickerOptions,
            datetime: [],
            pageConfig: {
                currentPage: 1,
                pageSize: 10,
                totle: 10
            }
        }
    },
    created() {
      this.fetchDate()
    },
    methods: {
        fetchDate() {
            this.loading = true;
            let loadingStartTime = new Date()
            API.get_log({
                pageSize: this.pageConfig.pageSize,
                currentPage: this.pageConfig.currentPage,
                startTime: this.datetime[0] ? moment(this.datetime[0]).add(-1, 'days').format('YYYY-MM-DD') : '',
                endTime: this.datetime[1] ?  moment(this.datetime[1]).format('YYYY-MM-DD') : '',
                filterText: this.filterText,
                filterType: this.filterType
            }).then(res => {
                setTimeout(() => {
                    this.tableData = res.data.result || []
                    this.pageConfig.total = res.data.total
                    this.loading = false;
                }, Date.now() - loadingStartTime < 300 ? 300 : 0)
            })
        },
        filterLogType(value, row) {
            return row.type === value
        },
        onSearch() {
            this.pageConfig.currentPage = 1
            this.fetchDate()
        },
        onReset() {
            this.pageConfig.currentPage = 1
            this.msg = this.url = this.filterText = ''
            this.datetime = []
            this.fetchDate()
        },
        handleCurrentChange(currentPage) {
            this.pageConfig.currentPage = currentPage;
            this.fetchDate()
        }
    },
    computed: {
        filterPlaceholder() {
           return this.filterOptions.find(x => x.value === this.filterType).label
        }
    }
}
</script>