import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Package,
  Box,
  Truck,
  Percent,
  AlertCircle,
  Info,
  Trash2,
  Plus,
  Save,
  Pencil,
  Check,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from './types';
import { calculatePricing, calculateCurrentMargin, ML_THRESHOLD, getEffectiveWeight } from './utils/pricing';

type CommentColor = 'green' | 'yellow' | 'red' | '';

interface SavedRecord {
  id: string;
  name: string;
  link: string;
  cost: number;
  packaging: number;
  categoryTax: number;
  taxPercentage: number;
  fixedFee: number;
  shippingFee: number;
  desiredMargin: number;
  weight: number;
  height: number;
  width: number;
  length: number;
  sellingPrice: number;
  mlCommission: number;
  taxes: number;
  profit: number;
  profitMargin: number;
  isFreeShipping: boolean;
  comment: string;
  commentColor: CommentColor;
}

const INITIAL_PRODUCT: Product = {
  id: '1',
  name: 'Folha',
  link: '',
  cost: 38.28,
  categoryTax: 11.5,
  taxPercentage: 4,
  packaging: 0.50,
  fixedFee: 8.15,
  shippingFee: 18.50,
  desiredMargin: 20,
  weight: 0,
  height: 0,
  width: 0,
  length: 0,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('meli-products');
      if (saved) {
        return JSON.parse(saved).map((p: any) => ({
          ...p,
          link: p.link || '',
          weight: p.weight || 0,
          height: p.height || 0,
          width: p.width || 0,
          length: p.length || 0,
        }));
      }
      return [INITIAL_PRODUCT];
    } catch {
      return [INITIAL_PRODUCT];
    }
  });
  const [selectedId, setSelectedId] = useState<string>(products[0]?.id || '1');
  const [currentPrice, setCurrentPrice] = useState<number>(59.00);
  const [activeTab, setActiveTab] = useState<'reverse' | 'current'>('reverse');

  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>(() => {
    try {
      const saved = localStorage.getItem('meli-records');
      if (saved) {
        return JSON.parse(saved).map((r: any) => ({
          ...r,
          link: r.link || '',
          weight: r.weight || 0,
          height: r.height || 0,
          width: r.width || 0,
          length: r.length || 0,
          comment: r.comment || '',
          commentColor: r.commentColor || '',
        }));
      }
      return [];
    } catch {
      return [];
    }
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const product = useMemo(() =>
    products.find(p => p.id === selectedId) || products[0] || INITIAL_PRODUCT,
  [products, selectedId]);

  useEffect(() => {
    localStorage.setItem('meli-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('meli-records', JSON.stringify(savedRecords));
  }, [savedRecords]);

  const pricingResult = useMemo(() => {
    if (activeTab === 'reverse') {
      return calculatePricing(product);
    } else {
      return calculateCurrentMargin(product, currentPrice);
    }
  }, [product, currentPrice, activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProducts(prev => prev.map(p => p.id === selectedId ? {
      ...p,
      [name]: parseFloat(value) || 0
    } : p));
  };

  const addNewProduct = () => {
    const newProduct: Product = {
      ...INITIAL_PRODUCT,
      id: Date.now().toString(),
      name: 'Novo Produto',
      link: '',
      weight: 0, height: 0, width: 0, length: 0,
    };
    setProducts(prev => [...prev, newProduct]);
    setSelectedId(newProduct.id);
  };

  const deleteProduct = (id: string) => {
    if (products.length <= 1) return;
    if (selectedId === id) {
      const remaining = products.filter(p => p.id !== id);
      setSelectedId(remaining[0].id);
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const saveRecord = () => {
    const record: SavedRecord = {
      id: Date.now().toString(),
      name: product.name,
      link: product.link,
      cost: product.cost,
      packaging: product.packaging,
      categoryTax: product.categoryTax,
      taxPercentage: product.taxPercentage,
      fixedFee: product.fixedFee,
      shippingFee: product.shippingFee,
      desiredMargin: product.desiredMargin,
      weight: product.weight,
      height: product.height,
      width: product.width,
      length: product.length,
      sellingPrice: pricingResult.sellingPrice,
      mlCommission: pricingResult.mlCommission,
      taxes: pricingResult.taxes,
      profit: pricingResult.profit,
      profitMargin: pricingResult.profitMargin,
      isFreeShipping: pricingResult.isFreeShipping,
      comment: '',
      commentColor: '',
    };
    setSavedRecords(prev => [...prev, record]);
  };

  const deleteRecord = (id: string) => {
    setSavedRecords(prev => prev.filter(r => r.id !== id));
  };

  const recalcRecord = (record: SavedRecord): SavedRecord => {
    const tempProduct: Product = {
      id: record.id,
      name: record.name,
      link: record.link,
      cost: record.cost,
      packaging: record.packaging,
      categoryTax: record.categoryTax,
      taxPercentage: record.taxPercentage,
      fixedFee: record.fixedFee,
      shippingFee: record.shippingFee,
      desiredMargin: record.desiredMargin,
      weight: record.weight,
      height: record.height,
      width: record.width,
      length: record.length,
    };
    const result = calculatePricing(tempProduct);
    return {
      ...record,
      sellingPrice: result.sellingPrice,
      mlCommission: result.mlCommission,
      taxes: result.taxes,
      profit: result.profit,
      profitMargin: result.profitMargin,
      isFreeShipping: result.isFreeShipping,
    };
  };

  const updateRecord = (id: string, field: keyof SavedRecord, value: number | string) => {
    setSavedRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === 'comment' || field === 'commentColor' || field === 'link') return updated;
      return recalcRecord(updated);
    }));
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-ml-yellow border-b border-slate-200 py-6 px-4 mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-ml-blue p-2 rounded-xl shadow-md">
              <Calculator className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">MeliCalc</h1>
              <p className="text-xs font-medium text-slate-700 uppercase tracking-widest opacity-70">Precificação Inteligente</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-700">
            <span className="flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full border border-slate-300/50">
              <Info size={14} className="text-ml-blue" /> Limiar Frete: <span className="font-bold">{formatCurrency(ML_THRESHOLD)}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Product List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Meus Produtos</h2>
            <button
              onClick={addNewProduct}
              className="p-1.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
              title="Adicionar Produto"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {products.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedId === p.id
                    ? 'bg-white border-brand-500 shadow-md ring-1 ring-brand-500'
                    : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${selectedId === p.id ? 'bg-brand-500' : 'bg-slate-300'}`} />
                  <span className={`text-sm font-semibold truncate ${selectedId === p.id ? 'text-slate-900' : 'text-slate-500'}`}>
                    {p.name}
                  </span>
                </div>
                {products.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                <Package size={18} />
              </div>
              <h2 className="text-lg font-semibold">Configuração</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label-text">Nome do Produto</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProducts(prev => prev.map(p => p.id === selectedId ? { ...p, name: e.target.value } : p))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-text">Link do Produto (ML)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ExternalLink size={14} />
                  </span>
                  <input
                    type="url"
                    value={product.link}
                    onChange={(e) => setProducts(prev => prev.map(p => p.id === selectedId ? { ...p, link: e.target.value } : p))}
                    className="input-field pl-9"
                    placeholder="https://produto.mercadolivre.com.br/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Custo (R$)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                    <input
                      type="number"
                      name="cost"
                      value={product.cost}
                      onChange={handleInputChange}
                      className="input-field pl-11"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="label-text">Embalagem (R$)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                    <input
                      type="number"
                      name="packaging"
                      value={product.packaging}
                      onChange={handleInputChange}
                      className="input-field pl-11"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Comissão ML (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="categoryTax"
                      value={product.categoryTax}
                      onChange={handleInputChange}
                      className="input-field pr-8"
                      step="0.1"
                      min="0"
                      max="99"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="label-text">Imposto (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="taxPercentage"
                      value={product.taxPercentage}
                      onChange={handleInputChange}
                      className="input-field pr-8"
                      step="0.1"
                      min="0"
                      max="99"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center gap-1.5 mb-3">
                  <Truck size={14} className="text-brand-500" />
                  <span className="label-text mb-0">Frete &mdash; Peso e Dimensões</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Peso (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={product.weight}
                      onChange={handleInputChange}
                      className="input-field"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="label-text">Altura (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={product.height}
                      onChange={handleInputChange}
                      className="input-field"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="label-text">Largura (cm)</label>
                    <input
                      type="number"
                      name="width"
                      value={product.width}
                      onChange={handleInputChange}
                      className="input-field"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="label-text">Comprimento (cm)</label>
                    <input
                      type="number"
                      name="length"
                      value={product.length}
                      onChange={handleInputChange}
                      className="input-field"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>

                {(() => {
                  const ew = getEffectiveWeight(product.weight, product.height, product.width, product.length);
                  const volW = (product.height * product.width * product.length) / 6000;
                  if (ew <= 0) return (
                    <p className="text-[11px] text-slate-400 mt-2">Preencha peso ou dimensões para calcular o frete automaticamente pela tabela ML.</p>
                  );
                  return (
                    <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      {volW > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Peso volumétrico</span>
                          <span className="font-mono font-semibold">{volW.toFixed(2)} kg</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Peso efetivo (usado no cálculo)</span>
                        <span className="font-mono font-bold text-brand-600">{ew.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Custo frete (auto)</span>
                        <span className="font-mono font-bold text-brand-600">
                          {formatCurrency(pricingResult.fixedFee + pricingResult.shippingFee)}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {getEffectiveWeight(product.weight, product.height, product.width, product.length) <= 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Taxa Fixa (&lt;79)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                      <input
                        type="number"
                        name="fixedFee"
                        value={product.fixedFee}
                        onChange={handleInputChange}
                        className="input-field pl-11"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label-text">Frete Grátis (&gt;=79)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                      <input
                        type="number"
                        name="shippingFee"
                        value={product.shippingFee}
                        onChange={handleInputChange}
                        className="input-field pl-11"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 border-brand-200 bg-brand-50/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                  <TrendingUp size={18} />
                </div>
                <h2 className="text-lg font-semibold">Meta de Lucro</h2>
              </div>
              <div className="flex bg-slate-200 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('reverse')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'reverse' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}
                >
                  REVERSO
                </button>
                <button
                  onClick={() => setActiveTab('current')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'current' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}
                >
                  ATUAL
                </button>
              </div>
            </div>

            {activeTab === 'reverse' ? (
              <div className="space-y-4">
                <label className="label-text">Margem Desejada (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="desiredMargin"
                    min="1"
                    max="50"
                    step="0.5"
                    value={product.desiredMargin}
                    onChange={handleInputChange}
                    className="input-field pr-8 text-xl font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="label-text">Preço de Venda Atual (R$)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">R$</span>
                  <input
                    type="number"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                    className="input-field pl-11 text-xl font-bold"
                    step="0.01"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId + activeTab + pricingResult.sellingPrice}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="glass-card overflow-hidden"
            >
              <div className="bg-slate-900 p-8 text-white">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    {activeTab === 'reverse' ? 'Preço de Venda Sugerido' : 'Análise de Preço Atual'}
                  </span>
                  {pricingResult.isFreeShipping ? (
                    <span className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black border border-green-500/30">
                      <Truck size={10} /> FRETE GRÁTIS
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-[10px] font-black border border-amber-500/30">
                      <AlertCircle size={10} /> TAXA FIXA
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tight">
                    {formatCurrency(pricingResult.sellingPrice)}
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Lucro Líquido</span>
                    <span className={`text-2xl font-bold ${pricingResult.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(pricingResult.profit)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Margem Real</span>
                    <span className={`text-2xl font-bold ${pricingResult.profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pricingResult.profitMargin.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalhamento de Custos</h3>

                <div className="space-y-3">
                  <CostRow label="Custo do Produto" value={product.cost} icon={<Package size={14} />} />
                  <CostRow label="Embalagem" value={product.packaging} icon={<Box size={14} />} />
                  <CostRow label={`Comissão ML (${product.categoryTax}%)`} value={pricingResult.mlCommission} icon={<Percent size={14} />} />

                  {pricingResult.isFreeShipping ? (
                    <CostRow label="Frete Grátis (ML)" value={pricingResult.shippingFee} icon={<Truck size={14} />} highlight />
                  ) : (
                    <CostRow label="Taxa Fixa (ML)" value={pricingResult.fixedFee} icon={<DollarSign size={14} />} highlight />
                  )}

                  <CostRow label={`Imposto (${product.taxPercentage}%)`} value={pricingResult.taxes} icon={<Info size={14} />} />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={saveRecord}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-brand-500 text-white font-bold text-sm rounded-xl hover:bg-brand-600 transition-colors shadow-sm"
                  >
                    <Save size={16} />
                    Inserir Registro
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom: Saved Records Table */}
      {savedRecords.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-10">
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                  <Calculator size={18} />
                </div>
                <h2 className="text-lg font-semibold">Registros Salvos</h2>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {savedRecords.length} {savedRecords.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="text-left px-4 py-3">Produto</th>
                    <th className="text-left px-3 py-3">Link</th>
                    <th className="text-right px-3 py-3">Custo</th>
                    <th className="text-right px-3 py-3">Embal.</th>
                    <th className="text-right px-3 py-3">Comissão %</th>
                    <th className="text-right px-3 py-3">Imposto %</th>
                    <th className="text-right px-3 py-3">Margem %</th>
                    <th className="text-right px-3 py-3">Preço Venda</th>
                    <th className="text-right px-3 py-3">Lucro</th>
                    <th className="text-right px-3 py-3">Margem Real</th>
                    <th className="text-left px-3 py-3">Comentário</th>
                    <th className="text-center px-3 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {savedRecords.map(record => {
                    const isEditing = editingId === record.id;
                    const colorBorder = record.commentColor === 'green' ? 'border-l-green-500'
                      : record.commentColor === 'yellow' ? 'border-l-amber-400'
                      : record.commentColor === 'red' ? 'border-l-red-500'
                      : 'border-l-transparent';
                    return (
                    <tr key={record.id} className={`border-b border-slate-50 border-l-4 ${colorBorder} hover:bg-slate-50/50 transition-colors`}>
                      {isEditing ? (
                        <>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={record.name}
                              onChange={e => updateRecord(record.id, 'name', e.target.value)}
                              className="w-full min-w-[100px] text-sm py-1 px-2 rounded-md border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="url"
                              value={record.link}
                              onChange={e => updateRecord(record.id, 'link', e.target.value)}
                              placeholder="https://..."
                              className="w-28 text-sm py-1 px-2 rounded-md border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={record.cost}
                              onChange={e => updateRecord(record.id, 'cost', parseFloat(e.target.value) || 0)}
                              step="0.01" min="0"
                              className="w-20 text-sm text-right py-1 px-2 rounded-md border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={record.packaging}
                              onChange={e => updateRecord(record.id, 'packaging', parseFloat(e.target.value) || 0)}
                              step="0.01" min="0"
                              className="w-20 text-sm text-right py-1 px-2 rounded-md border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={record.categoryTax}
                              onChange={e => updateRecord(record.id, 'categoryTax', parseFloat(e.target.value) || 0)}
                              step="0.1" min="0" max="99"
                              className="w-16 text-sm text-right py-1 px-2 rounded-md border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={record.taxPercentage}
                              onChange={e => updateRecord(record.id, 'taxPercentage', parseFloat(e.target.value) || 0)}
                              step="0.1" min="0" max="99"
                              className="w-16 text-sm text-right py-1 px-2 rounded-md border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={record.desiredMargin}
                                onChange={e => updateRecord(record.id, 'desiredMargin', parseFloat(e.target.value) || 0)}
                                step="0.5" min="1" max="50"
                                className="w-14 text-sm text-right py-1 px-2 rounded-md border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                              />
                              <span className="text-xs text-slate-400 ml-0.5">%</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                            {formatCurrency(record.sellingPrice)}
                          </td>
                          <td className={`px-3 py-2 text-right font-mono font-bold ${record.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {formatCurrency(record.profit)}
                          </td>
                          <td className={`px-3 py-2 text-right font-mono font-bold ${record.profitMargin >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {record.profitMargin.toFixed(2)}%
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-col gap-1.5">
                              <input
                                type="text"
                                value={record.comment}
                                onChange={e => updateRecord(record.id, 'comment', e.target.value)}
                                placeholder="Comentário..."
                                className="w-full min-w-[120px] text-sm py-1 px-2 rounded-md border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                              />
                              <div className="flex items-center gap-1.5">
                                {(['green', 'yellow', 'red'] as CommentColor[]).map(color => (
                                  <button
                                    key={color}
                                    onClick={() => updateRecord(record.id, 'commentColor', record.commentColor === color ? '' : color)}
                                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                                      color === 'green' ? 'bg-green-500' : color === 'yellow' ? 'bg-amber-400' : 'bg-red-500'
                                    } ${record.commentColor === color ? 'border-slate-900 scale-110' : 'border-white shadow-sm hover:scale-110'}`}
                                    title={color === 'green' ? 'Bom' : color === 'yellow' ? 'Atenção' : 'Ruim'}
                                  />
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Confirmar"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => deleteRecord(record.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Excluir"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 font-semibold text-slate-900">{record.name}</td>
                          <td className="px-3 py-3">
                            {record.link ? (
                              <a
                                href={record.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-brand-500 hover:text-brand-700 hover:underline transition-colors max-w-[140px] group"
                                title={record.link}
                              >
                                <ExternalLink size={13} className="flex-shrink-0" />
                                <span className="truncate text-xs font-medium">
                                  {(() => {
                                    try { return new URL(record.link).hostname.replace('www.', ''); } catch { return record.link; }
                                  })()}
                                </span>
                              </a>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-right font-mono text-slate-600">{formatCurrency(record.cost)}</td>
                          <td className="px-3 py-3 text-right font-mono text-slate-600">{formatCurrency(record.packaging)}</td>
                          <td className="px-3 py-3 text-right font-mono text-slate-600">{record.categoryTax}%</td>
                          <td className="px-3 py-3 text-right font-mono text-slate-600">{record.taxPercentage}%</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={record.desiredMargin}
                                onChange={e => updateRecord(record.id, 'desiredMargin', parseFloat(e.target.value) || 0)}
                                step="0.5" min="1" max="50"
                                className="w-12 text-xs text-right font-mono font-semibold text-slate-700 py-0.5 px-1 rounded border border-slate-200 bg-white outline-none focus:ring-1 focus:ring-brand-500 focus:border-transparent"
                              />
                              <span className="text-xs text-slate-400 ml-0.5">%</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">{formatCurrency(record.sellingPrice)}</td>
                          <td className={`px-3 py-3 text-right font-mono font-bold ${record.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {formatCurrency(record.profit)}
                          </td>
                          <td className={`px-3 py-3 text-right font-mono font-bold ${record.profitMargin >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {record.profitMargin.toFixed(2)}%
                          </td>
                          <td className="px-3 py-3">
                            {record.comment ? (
                              <div className="flex items-center gap-1.5">
                                {record.commentColor && (
                                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                    record.commentColor === 'green' ? 'bg-green-500' : record.commentColor === 'yellow' ? 'bg-amber-400' : 'bg-red-500'
                                  }`} />
                                )}
                                <span className="text-xs text-slate-600 truncate max-w-[150px]" title={record.comment}>{record.comment}</span>
                              </div>
                            ) : (
                              <span className="text-slate-300 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setEditingId(record.id)}
                                className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => deleteRecord(record.id)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Excluir"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <footer className="max-w-6xl mx-auto px-4 mt-12 text-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          MeliCalc v1.1 • Ferramenta de Análise de Lucratividade
        </p>
      </footer>
    </div>
  );
}

function CostRow({ label, value, icon, highlight = false }: { label: string, value: number, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${highlight ? 'bg-brand-50 border border-brand-100 shadow-sm' : 'hover:bg-slate-50 border border-transparent'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg ${highlight ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
          {icon}
        </div>
        <span className={`text-sm font-semibold ${highlight ? 'text-brand-700' : 'text-slate-600'}`}>{label}</span>
      </div>
      <span className={`font-mono text-sm font-bold ${highlight ? 'text-brand-700' : 'text-slate-900'}`}>
        - {formatCurrency(value)}
      </span>
    </div>
  );
}
