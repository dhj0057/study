import "./ShopCard.css";

// 쇼핑 정보 카드 1개 (props로 받은 값만 화면에 표시)
function ShopCard(props) {
    return (
        <div className="shop-card">
            <img className="shop-card-img" src={props.img} alt={props.title} />
            <p className="shop-card-tag">{props.tag}</p>
            <h3 className="shop-card-title">{props.title}</h3>
            <p className="shop-card-text">{props.period}</p>
            <p className="shop-card-text">{props.place}</p>
        </div>
    );
}

export default ShopCard;