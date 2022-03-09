import time, pymysql
from threading import Thread
def timer(func):
    def decor(*args):
        start_time = time.time()
        func(*args)
        end_time = time.time()
        d_time = end_time - start_time
        print("the running time is : ", d_time)
    return decor

@timer
def get_activity(n):
    conn = pymysql.connect(host='91.201.215.27' ,port=3306 ,user='skf_cloud_user', password='skf_cloud_password', db='skf_cloud_base', charset='utf8')
    cursor = conn.cursor()
    for i in range(0, n):
        try:
            sql = "select activity from agent_activity where date(start_time) > '2022-01-23'"
            cursor.execute(sql)


        except Exception as e:
            print(e)

    conn.commit()
    cursor.close()
    conn.close()
    print('OK')


target=get_activity(100)