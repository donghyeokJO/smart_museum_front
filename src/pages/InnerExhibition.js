import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import DashBoardHeader from "../components/DashBoardHeader";
import { ROOT_API } from "../utils/axios";
import { baseURL } from "../config";
import Button from 'react-bootstrap/Button';
import InnerExhibitionPost from "../utils/InnerExhibitionPost";
import Pagination from "../utils/pagination";


import style from './css/admin/InnerExhibition.module.css'

function InnerExhibition() {
    const [Name, setName] = useState('');
    const [floor, setfloor] = useState('전체');

    const [innerList, setinnerList] = useState([]);
    const [ExhibitionList, setExhibitionList] = useState([]);

    const user_id = localStorage.getItem('user_id');
    const access = localStorage.getItem('access');

    const [Active, setActive] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(6);

    const indexOfLast = Active * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;

    const currentInnerList = (posts) => {
        let currentUser = 0;
        currentUser = posts.slice(indexOfFirst, indexOfLast);
        return currentUser;
    };

    const originalitems = [
        { floor: "1층", num: "1", txt: "고래와 바다이야기", src: "./img/sub/exhibition01.jpg", id: "1" },
        { floor: "1층", num: "2", txt: "고래와 바다이야기2", src: "./img/sub/exhibition02.jpg", id: "2" },
        { floor: "1층", num: "3", txt: "수산생물의 진화로 보는 바다의 시간", src: "./img/sub/exhibition03.jpg", id: "3" },
        { floor: "2층", num: "1", txt: "수산과학과 수산자원", src: "./img/sub/exhibition04.jpg", id: "4" },
        { floor: "2층", num: "2", txt: "어업기술의 발전", src: "./img/sub/exhibition05.jpg", id: "5" },
        { floor: "지하1층", num: "1", txt: "물고기 문화 예술품 전시실", src: "./img/sub/exhibition06.jpg", id: "6" }
    ];

    const [items, setitems] = useState([]);

    useEffect(() => {
        ROOT_API.user_info(user_id, 'JWT ' + access)
            .then((res) => {
                setName({ Name: res.data['username'] });
            })
            .catch((err) => {
                console.log(err)
            })
    }, []);

    useEffect(() => {
        ROOT_API.inner_exhibition_user('JWT ' + access, user_id)
            .then((res) => {
                // console.log(res.data[0]['exhibition']['floor_ko']);
                setinnerList(res.data);
                setitems(res.data);
            })
    }, []);

    useEffect(() => {
        // console.log('ss');
        ROOT_API.museum_list('JWT ' + access, user_id)
            .then((res) => {
                setExhibitionList(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const floors = ExhibitionList.map((exhibition) => {
        return exhibition['floor_ko'];
    })

    const currentFloor = floor => {
        if (floor === "전체") {
            setitems(innerList);
            return
        }

        // setitems(originalitems);
        setitems(innerList.filter(item => item['exhibition']['floor_ko'] === floor));
    }

    return (
        <body className={style.body}>
            <DashBoardHeader exhibition={true} ex2={true}></DashBoardHeader>
            <div className={style.Dashcontainer}>
                <nav className={`${style.DashsubNav} ${style.clearfix}`}>
                    <div className={style.place}>
                        <i className="far fa-edit"></i>전시관 관리
                        <span><i className="fas fa-angle-right"></i>전시관 정보 관리</span>
                    </div>
                    <div className={style.user}>
                        <ul className={style.clearfix}>
                            <li><i className="fas fa-user"></i>{Name.Name}님</li>
                            <li><a href="#" title="로그아웃하기" onClick={function () { localStorage.clear(); window.location.href = '/' }} ><i className="fas fa-unlock"></i>로그아웃</a></li>
                        </ul>
                    </div>
                </nav>
                <div className={`${style.content} ${style.ManageInfo}`}>
                    <div className={style.pageHead}>
                        <h1 className={`${style.h1} ${style.tit}`}>전시관 정보 관리</h1>
                        <div className={style.Headgroup}>
                            <Button variant="primary" onClick={() => window.location.href = '/inner-exhibition-add'}>새 전시관 등록&nbsp;&nbsp;<i className="fas fa-plus"></i></Button>{' '}
                        </div>
                    </div>
                    <ul id={style.tabul}>
                        <li className={floor === "전체" ? style.on : null} onClick={() => { setfloor('전체'); currentFloor("전체"); setActive(1); }}>전체</li>
                        {floors.map((f) => {
                            return (
                                <li className={floor === f ? style.on : null} onClick={() => { setfloor(f); currentFloor(f); setActive(1); }}>{f}</li>
                            )
                        })}
                    </ul>


                    <div className={`${style.tabcont} ${style.clearfix}`}>
                        <div className={`${style.all} ${style.clearfix}`}>
                            <InnerExhibitionPost innerExhibition={currentInnerList(items)} floors={floors}></InnerExhibitionPost>
                        </div>
                    </div>
                    <Pagination
                        postsPerPage={postsPerPage}
                        totalPosts={items.length}
                        paginate={setActive}
                    ></Pagination>
                </div>
            </div>
        </body>
    );

}

export default withRouter(InnerExhibition);