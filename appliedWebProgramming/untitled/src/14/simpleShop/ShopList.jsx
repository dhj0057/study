import ShopCard from "./ShopCard";
import "./ShopCard.css";
import img1 from "./imgs/elephant_character.png";
import img2 from "./imgs/koala_character.png";
import img3 from "./imgs/lion_character.png";
import img4 from "./imgs/panda_character.png";
import img5 from "./imgs/squirrel_character.png";
import img6 from "./imgs/tiger_character.png";

const shopItems = [
    { id: 1, img : img1 ,label: "SEASON OFF", tag: "SEASON OFF | 강남점", title: "시즌오프", period: "26.11.12(목) - 26.11.29(일)", place: "각 층 브랜드 매장", color: "#555555" },
    { id: 2, img : img2 ,label: "SALE", tag: "SALE | 강남점", title: "윈터 세일", period: "26.11.12(목) - 26.11.29(일)", place: "각 층 브랜드 매장", color: "#3b4252" },
    { id: 3, img : img3 ,label: "POP-UP", tag: "OPEN STAGE | 강남점", title: "향수 팝업 스토어", period: "26.11.20(금) - 26.12.01(화)", place: "1층 오픈 스테이지", color: "#b98a4a" },
    { id: 4, img : img4 ,label: "BEAUTY", tag: "BEAUTY | 강남점", title: "홀리데이 뷰티 컬렉션", period: "26.11.23(월) - 26.12.25(금)", place: "1층 화장품 매장", color: "#8a5a3c" },
    { id: 5, img : img5 ,label: "GIFT", tag: "EVENT | 강남점", title: "구매 금액별 사은품 증정", period: "26.11.27(금) - 26.11.29(일)", place: "지하 1층 사은 데스크", color: "#a8323e" },
    { id: 6, img : img6 ,label: "MEN'S", tag: "THEME | 강남점", title: "남성 아우터 위크", period: "26.11.26(목) - 26.12.06(일)", place: "6층 남성 패션", color: "#3f5a4c" },
];

// 데이터 배열을 map으로 돌면서 ShopCard 컴포넌트를 반복 사용
function ShopList(props) {
    return (
        <div className="shop-page">
            <h2 className="shop-page-title">쇼핑 정보</h2>
            <div className="shop-grid">
                {shopItems.map((item) => (
                    <ShopCard
                        img={item.img}
                        key={item.id}
                        label={item.label}
                        tag={item.tag}
                        title={item.title}
                        period={item.period}
                        place={item.place}
                        color={item.color}
                    />
                ))}
            </div>
        </div>
    );
}

export default ShopList;
