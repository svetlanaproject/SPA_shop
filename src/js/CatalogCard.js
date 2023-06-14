export class CatalogCard {
    constructor(src, alt, title, subtitle, descr, price, parentSelector) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.subtitle = subtitle;
        this.descr = descr;
        this.price = price;
        this.parent = document.querySelector(parentSelector);
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = `
            <div class="catalog-item">
                <div class="catalog-item__wrapper">
                    <div class="catalog-item__content catalog-item__content_active">
                        <img src="${require(this.src)}" alt=${this.alt} class="catalog-item__img">
                        <div class="catalog-item__subtitle">${this.title}<br> ${this.subtitle} </div>
                        <div class="catalog-item__descr">${this.descr}</div>
                        <a href="#" class="catalog-item__link" id="details-1">ПОДРОБНЕЕ</a>
                    </div>
                    <ul class="catalog-item__list" data-target="details-1">
                        <li>Максимальная масса пользователя 110 кг.</li>
                        <li>Ручная регулировка угла наклона полотна.</li>
                        <li>На дисплее отображается: время тренировки, пройденная дистанция,
                            текущая скорость, расход калорий, пульс.
                        </li>
                        <li>Высота 139 см, ширина 66 см, длина 130 см, масса 30 кг.</li>
                        <a href="#" class="catalog-item__back">назад</a>
                    </ul>
                </div>
                <hr>
                <div class="catalog-item__footer">
                    <div class="catalog-item__price">${this.price}</div>
                    <button class="button button_mini" data-itemname="Беговая дорожка Body Style TT 287">КУПИТЬ</button>
                </div>
            </div>
        `;
        this.parent.append(element);
    } 
}